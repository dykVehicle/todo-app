'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // 从 localStorage 加载数据
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTodos(parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt)
        })));
      } catch (e) {
        console.error('Failed to load todos:', e);
      }
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      priority,
      createdAt: new Date(),
    };
    setTodos([newTodo, ...todos]);
    setInputValue('');
    setPriority('medium');
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id: number, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '';
    }
  };

  const activeTodos = todos.filter(t => !t.completed).length;
  const completedTodos = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            📝 待办清单
          </h1>
          <p className="text-gray-600">高效管理你的每一天</p>
        </div>

        {/* 输入区域 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="添加新的待办事项..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-lg"
            />
            <button
              onClick={addTodo}
              className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors text-lg shadow-md hover:shadow-lg"
            >
              添加
            </button>
          </div>

          {/* 优先级选择 */}
          <div className="flex gap-4">
            <span className="text-gray-600 font-medium">优先级：</span>
            {(['high', 'medium', 'low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  priority === p
                    ? getPriorityColor(p)
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {getPriorityText(p)}
              </button>
            ))}
          </div>
        </div>

        {/* 统计信息 */}
        {todos.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{todos.length}</div>
              <div className="text-sm text-gray-600">全部</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{activeTodos}</div>
              <div className="text-sm text-gray-600">进行中</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{completedTodos}</div>
              <div className="text-sm text-gray-600">已完成</div>
            </div>
          </div>
        )}

        {/* 过滤器 */}
        {todos.length > 0 && (
          <div className="flex gap-2 mb-4 justify-center">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
                }`}
              >
                {f === 'all' ? '全部' : f === 'active' ? '进行中' : '已完成'}
              </button>
            ))}
          </div>
        )}

        {/* 清除已完成按钮 */}
        {completedTodos > 0 && (
          <div className="mb-4 text-center">
            <button
              onClick={clearCompleted}
              className="text-red-500 hover:text-red-700 hover:underline"
            >
              清除已完成事项
            </button>
          </div>
        )}

        {/* 待办列表 */}
        <div className="space-y-3">
          {getFilteredTodos().length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center text-gray-500">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-lg font-medium">
                {filter === 'all' ? '还没有待办事项，添加一个吧！' :
                 filter === 'active' ? '没有进行中的事项，干得漂亮！' :
                 '还没有完成的事项，继续努力！'}
              </p>
            </div>
          ) : (
            getFilteredTodos().map((todo) => (
              <div
                key={todo.id}
                className={`bg-white rounded-xl shadow-lg p-4 transition-all hover:shadow-xl ${
                  todo.completed ? 'opacity-70 bg-gray-50' : 'opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* 复选框 */}
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {todo.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* 优先级标签 */}
                  <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getPriorityColor(todo.priority)}`}>
                    {getPriorityText(todo.priority)}
                  </span>

                  {/* 文本内容 */}
                  <input
                    type="text"
                    value={todo.text}
                    onChange={(e) => editTodo(todo.id, e.target.value)}
                    className={`flex-1 bg-transparent border-none focus:outline-none text-lg ${
                      todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  />

                  {/* 删除按钮 */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title="删除"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>💡 提示：数据会自动保存在本地，刷新不会丢失</p>
        </div>
      </div>
    </div>
  );
}
