
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusLicitacao } from '@/types/licitacao';
import { STATUS_OPTIONS, getStatusColor } from '@/utils/statusOptions';

interface StatusSelectorProps {
  currentStatus: StatusLicitacao;
  onStatusChange: (status: StatusLicitacao) => void;
  onClose: () => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ currentStatus, onStatusChange, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <Card className="w-64 bg-white shadow-lg border">
          <CardContent className="p-3">
            <div className="space-y-1">
              <h4 className="text-sm font-medium mb-2 text-center">Alterar Status</h4>
              {STATUS_OPTIONS.map((status) => (
                <Button
                  key={status}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-xs px-2 py-1 h-auto ${
                    status === currentStatus ? 'ring-2 ring-blue-500' : ''
                  } ${getStatusColor(status)}`}
                  onClick={() => onStatusChange(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatusSelector;
