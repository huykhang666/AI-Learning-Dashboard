import React, { useState } from 'react';

const AccountSettings = () => {
  // Quản lý tab đang được chọn
  const [activeTab, setActiveTab] = useState('account');
  
  // Quản lý dữ liệu form
  const [formData, setFormData] = useState({
    name: 'Nguyễn Huy Khang',
    email: 'huukhang@email.com'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-3xl">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Account</h1>
          <p className="text-slate-500 text-sm mt-1">Cài đặt tài khoản</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('account')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'account' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'preferences' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Preferences
          </button>
        </div>

        {/* Main Card Content */}
        {activeTab === 'account' ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 max-w-xl">
            
            {/* Input Name */}
            <div className="mb-5">
              <label className="block text-[#8A9BB1] text-xs font-medium mb-2 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Input Email */}
            <div className="mb-6">
              <label className="block text-[#8A9BB1] text-xs font-medium mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Avatar Section */}
            <div className="mb-8">
              <label className="block text-[#8A9BB1] text-xs font-medium mb-3 uppercase tracking-wide">
                Avatar
              </label>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  NK
                </div>
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95">
                  Change
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md shadow-blue-500/30 transition-all active:scale-95">
              Save Changes
            </button>
            
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-xl text-center">
            <p className="text-slate-500">Giao diện Preferences đang được phát triển...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;