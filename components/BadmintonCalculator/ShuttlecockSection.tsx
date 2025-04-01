import { Typography, InputNumber } from 'antd';
import { Shuttlecock } from '@/interface';

interface ShuttlecockSectionProps {
  shuttlecock: Shuttlecock;
  onShuttlecockChange: (shuttlecock: Shuttlecock) => void;
}

export const ShuttlecockSection = ({ shuttlecock, onShuttlecockChange }: ShuttlecockSectionProps) => {
  const totalShuttlecockCost = shuttlecock.quantity * shuttlecock.pricePerPiece;

  return (
    <div>
      <Typography.Title level={5}>Shuttlecock</Typography.Title>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Typography.Text className="mb-1 block text-sm">Shuttlecock Price</Typography.Text>
          <InputNumber
            placeholder="Enter price per shuttlecock"
            value={shuttlecock.pricePerPiece || null}
            onChange={value => onShuttlecockChange({ ...shuttlecock, pricePerPiece: value || 0 })}
            className="w-full [&_input]:!outline-none [&_input]:!ring-0"
            prefix="฿"
            min={0}
            pattern="[0-9]*"
            type="number"
            controls={false}
          />
        </div>
        <div className="flex-1">
          <Typography.Text className="mb-1 block text-sm">Number of Shuttlecocks</Typography.Text>
          <InputNumber
            placeholder="Enter number of shuttlecocks used"
            value={shuttlecock.quantity || null}
            onChange={value => onShuttlecockChange({ ...shuttlecock, quantity: value || 0 })}
            className="w-full [&_input]:!outline-none [&_input]:!ring-0"
            min={0}
            pattern="[0-9]*"
            type="number"
            controls={false}
          />
        </div>
      </div>
      <div className="mt-2 text-right">
        <Typography.Text type="secondary">
          Total Shuttlecock Cost: ฿{totalShuttlecockCost.toFixed(2)}
        </Typography.Text>
      </div>
    </div>
  );
}; 