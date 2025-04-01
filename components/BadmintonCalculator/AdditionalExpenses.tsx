import { Typography, Input, InputNumber, Button, Select, Radio } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { CustomExpense, PlayerStats } from '@/interface';
import { calculateTotalCustomExpenses } from '@/utils/calculatorLogic';

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
  const totalCustomExpenses = calculateTotalCustomExpenses(customExpenses, players.length);

  const handleCustomExpenseChange = (
    id: string,
    field: 'name' | 'amount' | 'assignedTo' | 'isShared',
    value: string | number | string[] | boolean
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
      assignedTo: [],
      isShared: true // Default to shared mode
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
          <div className="flex flex-col gap-2">
            <Select
              mode="multiple"
              placeholder="Assign to players (optional)"
              value={expense.assignedTo}
              onChange={value => handleCustomExpenseChange(expense.id, 'assignedTo', value)}
              className="w-full"
              allowClear
              virtual={false}
              dropdownMatchSelectWidth={false}
              maxTagCount="responsive"
              showSearch={false}
              onDropdownVisibleChange={(visible) => {
                if (visible) {
                  // Prevent keyboard from opening
                  const selectInput = document.querySelector('.ant-select-selector input') as HTMLElement;
                  if (selectInput) {
                    selectInput.setAttribute('readonly', 'true');
                    setTimeout(() => {
                      selectInput.removeAttribute('readonly');
                    }, 100);
                  }
                }
              }}
            >
              {players.map(player => (
                <Select.Option key={player.name} value={player.name}>
                  {player.name}
                </Select.Option>
              ))}
            </Select>
            {players.length > 0 && (
              <Radio.Group
                value={expense.isShared ?? true}
                onChange={e => handleCustomExpenseChange(expense.id, 'isShared', e.target.value)}
                className="grid grid-cols-2 gap-0"
                buttonStyle="solid"
                defaultValue={true}
              >
                <Radio.Button value={true} className="text-center">Share Equally</Radio.Button>
                <Radio.Button value={false} className="text-center">Each Player Pays Full</Radio.Button>
              </Radio.Group>
            )}
          </div>
          {expense.assignedTo.length > 0 ? (
            <Typography.Text type="secondary" className="text-sm">
              Each selected player will pay ฿{(expense.amount / expense.assignedTo.length).toFixed(2)}
            </Typography.Text>
          ) : players.length > 0 ? (
            <Typography.Text type="secondary" className="text-sm">
              {expense.isShared ? (
                `Each player will pay ฿${(expense.amount / players.length).toFixed(2)}`
              ) : (
                `Each player will pay ฿${expense.amount.toFixed(2)}`
              )}
            </Typography.Text>
          ) : null}
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