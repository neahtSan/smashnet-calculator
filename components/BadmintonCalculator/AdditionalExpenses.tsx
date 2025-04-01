import { Typography, Input, InputNumber, Button, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { CustomExpense, PlayerStats } from '@/interface';

interface AdditionalExpensesProps {
  customExpenses: CustomExpense[];
  players: PlayerStats[];
  onCustomExpensesChange: (expenses: CustomExpense[]) => void;
}

export const AdditionalExpenses = ({ 
  customExpenses, 
  players, 
  onCustomExpensesChange 
}: AdditionalExpensesProps) => {
  const totalCustomExpenses = customExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleCustomExpenseChange = (
    id: string,
    field: 'name' | 'amount' | 'assignedTo',
    value: string | number | string[]
  ) => {
    onCustomExpensesChange(customExpenses.map(expense =>
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const handleAddCustomExpense = () => {
    const newExpense: CustomExpense = {
      id: Date.now().toString(),
      name: 'Expense',
      amount: 0,
      assignedTo: []
    };
    onCustomExpensesChange([...customExpenses, newExpense]);
  };

  const handleDeleteCustomExpense = (id: string) => {
    onCustomExpensesChange(customExpenses.filter(expense => expense.id !== id));
  };

  return (
    <div>
      <Typography.Title level={5}>Additional Expenses</Typography.Title>
      {customExpenses.map(expense => (
        <div key={expense.id} className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter expense name"
              value={expense.name}
              onChange={e => handleCustomExpenseChange(expense.id, 'name', e.target.value)}
              className="flex-1 [&_input]:!outline-none [&_input]:!ring-0"
              onFocus={(e) => {
                e.target.select();
                handleCustomExpenseChange(expense.id, 'name', '');
              }}
              onBlur={(e) => {
                if (!e.target.value) {
                  handleCustomExpenseChange(expense.id, 'name', 'Expense');
                }
              }}
            />
            <InputNumber
              placeholder="Enter amount"
              value={expense.amount || null}
              onChange={value => handleCustomExpenseChange(expense.id, 'amount', value || 0)}
              className="w-32 [&_input]:!outline-none [&_input]:!ring-0"
              prefix="฿"
              min={0}
              pattern="[0-9]*"
              type="number"
              controls={false}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteCustomExpense(expense.id)}
            />
          </div>
          <Select
            mode="multiple"
            placeholder="Assign to players (optional)"
            value={expense.assignedTo}
            onChange={value => handleCustomExpenseChange(expense.id, 'assignedTo', value)}
            className="w-full"
            allowClear
          >
            {players.map(player => (
              <Select.Option key={player.name} value={player.name}>
                {player.name}
              </Select.Option>
            ))}
          </Select>
          {expense.assignedTo.length > 0 && (
            <Typography.Text type="secondary" className="text-sm">
              Each selected player will pay ฿{expense.amount.toFixed(2)}
            </Typography.Text>
          )}
        </div>
      ))}
      <Button
        type="dashed"
        onClick={handleAddCustomExpense}
        icon={<PlusOutlined />}
        className="w-full mt-2"
      >
        Add Expense
      </Button>
      {customExpenses.length > 0 && (
        <div className="mt-2 text-right">
          <Typography.Text type="secondary">
            Total Additional Expenses: ฿{totalCustomExpenses.toFixed(2)}
          </Typography.Text>
        </div>
      )}
    </div>
  );
}; 