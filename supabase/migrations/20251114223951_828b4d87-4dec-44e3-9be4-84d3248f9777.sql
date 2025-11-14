-- Create audit_logs table for tracking all data access
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own audit logs
CREATE POLICY "Users can view their own audit logs"
ON public.audit_logs FOR SELECT
USING (auth.uid() = user_id);

-- System can insert audit logs (for triggers)
CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true);

-- Create function to log consultation access
CREATE OR REPLACE FUNCTION public.log_consultation_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      user_id,
      table_name,
      operation,
      record_id,
      new_data
    ) VALUES (
      current_user_id,
      'consultations',
      'INSERT',
      NEW.id,
      to_jsonb(NEW)
    );
    RETURN NEW;
    
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (
      user_id,
      table_name,
      operation,
      record_id,
      old_data,
      new_data
    ) VALUES (
      current_user_id,
      'consultations',
      'UPDATE',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
    
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      user_id,
      table_name,
      operation,
      record_id,
      old_data
    ) VALUES (
      current_user_id,
      'consultations',
      'DELETE',
      OLD.id,
      to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create triggers for consultations table
CREATE TRIGGER audit_consultations_insert
AFTER INSERT ON public.consultations
FOR EACH ROW
EXECUTE FUNCTION public.log_consultation_audit();

CREATE TRIGGER audit_consultations_update
AFTER UPDATE ON public.consultations
FOR EACH ROW
EXECUTE FUNCTION public.log_consultation_audit();

CREATE TRIGGER audit_consultations_delete
AFTER DELETE ON public.consultations
FOR EACH ROW
EXECUTE FUNCTION public.log_consultation_audit();

-- Create function to log prescription access
CREATE OR REPLACE FUNCTION public.log_prescription_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      user_id,
      table_name,
      operation,
      record_id,
      new_data
    ) VALUES (
      current_user_id,
      'prescriptions',
      'INSERT',
      NEW.id,
      to_jsonb(NEW)
    );
    RETURN NEW;
    
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (
      user_id,
      table_name,
      operation,
      record_id,
      old_data,
      new_data
    ) VALUES (
      current_user_id,
      'prescriptions',
      'UPDATE',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
    
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      user_id,
      table_name,
      operation,
      record_id,
      old_data
    ) VALUES (
      current_user_id,
      'prescriptions',
      'DELETE',
      OLD.id,
      to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create triggers for prescriptions table
CREATE TRIGGER audit_prescriptions_insert
AFTER INSERT ON public.prescriptions
FOR EACH ROW
EXECUTE FUNCTION public.log_prescription_audit();

CREATE TRIGGER audit_prescriptions_update
AFTER UPDATE ON public.prescriptions
FOR EACH ROW
EXECUTE FUNCTION public.log_prescription_audit();

CREATE TRIGGER audit_prescriptions_delete
AFTER DELETE ON public.prescriptions
FOR EACH ROW
EXECUTE FUNCTION public.log_prescription_audit();

-- Create function to log medication order access
CREATE OR REPLACE FUNCTION public.log_medication_order_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (
      user_id,
      table_name,
      operation,
      record_id,
      new_data
    ) VALUES (
      current_user_id,
      'medication_orders',
      'INSERT',
      NEW.id,
      to_jsonb(NEW)
    );
    RETURN NEW;
    
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (
      user_id,
      table_name,
      operation,
      record_id,
      old_data,
      new_data
    ) VALUES (
      current_user_id,
      'medication_orders',
      'UPDATE',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
    
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      user_id,
      table_name,
      operation,
      record_id,
      old_data
    ) VALUES (
      current_user_id,
      'medication_orders',
      'DELETE',
      OLD.id,
      to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create triggers for medication_orders table
CREATE TRIGGER audit_medication_orders_insert
AFTER INSERT ON public.medication_orders
FOR EACH ROW
EXECUTE FUNCTION public.log_medication_order_audit();

CREATE TRIGGER audit_medication_orders_update
AFTER UPDATE ON public.medication_orders
FOR EACH ROW
EXECUTE FUNCTION public.log_medication_order_audit();

CREATE TRIGGER audit_medication_orders_delete
AFTER DELETE ON public.medication_orders
FOR EACH ROW
EXECUTE FUNCTION public.log_medication_order_audit();

-- Create index for faster audit log queries
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);