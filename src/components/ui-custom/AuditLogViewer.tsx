import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Shield, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  user_id: string | null;
  table_name: string;
  operation: string;
  record_id: string | null;
  old_data: any;
  new_data: any;
  timestamp: string;
}

export default function AuditLogViewer() {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [filterTable, setFilterTable] = useState<string>('all');
  const [filterOperation, setFilterOperation] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchAuditLogs();
    }
  }, [user]);

  useEffect(() => {
    let filtered = auditLogs;

    if (filterTable !== 'all') {
      filtered = filtered.filter(log => log.table_name === filterTable);
    }

    if (filterOperation !== 'all') {
      filtered = filtered.filter(log => log.operation === filterOperation);
    }

    setFilteredLogs(filtered);
  }, [filterTable, filterOperation, auditLogs]);

  const fetchAuditLogs = async () => {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', user?.id)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (!error && data) {
      setAuditLogs(data);
      setFilteredLogs(data);
    }
  };

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case 'INSERT':
        return 'bg-green-500';
      case 'UPDATE':
        return 'bg-blue-500';
      case 'DELETE':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTableDisplayName = (tableName: string) => {
    switch (tableName) {
      case 'consultations':
        return 'Consultations';
      case 'prescriptions':
        return 'Prescriptions';
      case 'medication_orders':
        return 'Medication Orders';
      default:
        return tableName;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Audit Logs
            </CardTitle>
            <CardDescription>
              Complete access history of your medical data for compliance
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            HIPAA Compliant
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Filter by Table</label>
            <Select value={filterTable} onValueChange={setFilterTable}>
              <SelectTrigger>
                <SelectValue placeholder="All Tables" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tables</SelectItem>
                <SelectItem value="consultations">Consultations</SelectItem>
                <SelectItem value="prescriptions">Prescriptions</SelectItem>
                <SelectItem value="medication_orders">Medication Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Filter by Operation</label>
            <Select value={filterOperation} onValueChange={setFilterOperation}>
              <SelectTrigger>
                <SelectValue placeholder="All Operations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Operations</SelectItem>
                <SelectItem value="INSERT">Created</SelectItem>
                <SelectItem value="UPDATE">Updated</SelectItem>
                <SelectItem value="DELETE">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No audit logs found</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <Card key={log.id} className="border-l-4" style={{ borderLeftColor: getOperationColor(log.operation).replace('bg-', '#') }}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getOperationColor(log.operation)}>
                          {log.operation}
                        </Badge>
                        <Badge variant="outline">
                          {getTableDisplayName(log.table_name)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                      </div>
                    </div>

                    {log.operation === 'INSERT' && log.new_data && (
                      <div className="mt-3 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-1">Created Record</p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {Object.entries(log.new_data).map(([key, value]) => {
                            if (key === 'id' || key === 'user_id' || key === 'created_at' || key === 'updated_at') {
                              return null;
                            }
                            return (
                              <div key={key}>
                                <span className="font-medium">{key}:</span>{' '}
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {log.operation === 'UPDATE' && log.old_data && log.new_data && (
                      <div className="mt-3 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-1">Updated Fields</p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {Object.keys(log.new_data).map((key) => {
                            if (key === 'id' || key === 'user_id' || key === 'updated_at') {
                              return null;
                            }
                            if (JSON.stringify(log.old_data[key]) !== JSON.stringify(log.new_data[key])) {
                              return (
                                <div key={key}>
                                  <span className="font-medium">{key}:</span>{' '}
                                  <span className="line-through text-red-500">{String(log.old_data[key])}</span>
                                  {' → '}
                                  <span className="text-green-500">{String(log.new_data[key])}</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}

                    {log.operation === 'DELETE' && log.old_data && (
                      <div className="mt-3 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-1">Deleted Record</p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {Object.entries(log.old_data).map(([key, value]) => {
                            if (key === 'id' || key === 'user_id' || key === 'created_at' || key === 'updated_at') {
                              return null;
                            }
                            return (
                              <div key={key}>
                                <span className="font-medium">{key}:</span>{' '}
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}