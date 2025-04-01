import { Typography, InputNumber } from 'antd';
import { CourtFee, CourtFeeSectionProps } from '@/interface';

export const CourtFeeSection = ({ courtFee, onCourtFeeChange }: CourtFeeSectionProps) => {
  const totalCourtFee = courtFee.hourlyRate * courtFee.hours;

  return (
    <div>
      <Typography.Title level={5}>Court Fee</Typography.Title>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Typography.Text className="mb-1 block text-sm">Court Rate per Hour</Typography.Text>
          <InputNumber
            placeholder="Enter court rate per hour"
            value={courtFee.hourlyRate || null}
            onChange={value => onCourtFeeChange({ ...courtFee, hourlyRate: value || 0 })}
            className="w-full [&_input]:!outline-none [&_input]:!ring-0"
            prefix="฿"
            min={0}
            pattern="[0-9]*"
            type="number"
            controls={false}
          />
        </div>
        <div className="flex-1">
          <Typography.Text className="mb-1 block text-sm">Number of Hours</Typography.Text>
          <InputNumber
            placeholder="Enter number of hours"
            value={courtFee.hours || null}
            onChange={value => onCourtFeeChange({ ...courtFee, hours: value || 0 })}
            className="w-full [&_input]:!outline-none [&_input]:!ring-0"
            min={0}
            step={0.5}
            pattern="[0-9]*"
            type="number"
            controls={false}
          />
        </div>
      </div>
      <div className="mt-2 text-right">
        <Typography.Text type="secondary">
          Total Court Fee: ฿{totalCourtFee.toFixed(2)}
        </Typography.Text>
      </div>
    </div>
  );
}; 