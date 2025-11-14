import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prescriptionId, prescriptionImageUrl } = await req.json();
    console.log('Verifying prescription:', prescriptionId);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the prescription image from storage
    const { data: imageData, error: imageError } = await supabase
      .storage
      .from('prescriptions')
      .download(prescriptionImageUrl);

    if (imageError) {
      console.error('Error fetching prescription image:', imageError);
      throw new Error('Failed to fetch prescription image');
    }

    // Convert image to base64
    const arrayBuffer = await imageData.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Use OpenAI Vision API to analyze prescription
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this medical prescription image and extract the following information in JSON format:
                {
                  "isValid": boolean (true if this appears to be a legitimate medical prescription),
                  "doctorName": string (doctor's name if visible),
                  "doctorLicense": string (license number if visible),
                  "medications": array of strings (list of medications prescribed),
                  "expiryDate": string (prescription expiry date if visible, in YYYY-MM-DD format),
                  "concerns": array of strings (any concerns or issues with the prescription)
                }
                
                Be thorough and check for:
                - Doctor's signature and credentials
                - Clear medication names and dosages
                - Valid date
                - Professional formatting
                - No signs of tampering or forgery`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('Failed to analyze prescription');
    }

    const visionResult = await visionResponse.json();
    const analysisText = visionResult.choices[0].message.content;
    
    // Parse the JSON response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      isValid: false,
      concerns: ['Failed to parse prescription data']
    };

    console.log('Prescription analysis result:', analysis);

    // Update prescription in database
    const verificationStatus = analysis.isValid ? 'approved' : 'rejected';
    const { error: updateError } = await supabase
      .from('prescriptions')
      .update({
        verification_status: verificationStatus,
        ai_verification_result: analysis,
        verified_at: new Date().toISOString(),
        doctor_name: analysis.doctorName || null,
        doctor_license: analysis.doctorLicense || null,
        expires_at: analysis.expiryDate || null,
      })
      .eq('id', prescriptionId);

    if (updateError) {
      console.error('Error updating prescription:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        verification_status: verificationStatus,
        analysis 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Prescription verification error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});