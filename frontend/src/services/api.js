const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = (withAuth = true) => {
  const h = { 'Content-Type': 'application/json' };
  if (withAuth && getToken()) h['Authorization'] = `Bearer ${getToken()}`;
  return h;
};

const api = {
  // Auth
  login: (email, password) =>
    fetch(`${API_URL}/auth/login`, { method: 'POST', headers: headers(false), body: JSON.stringify({ email, password }) }).then(r => r.json()),

  register: (name, email, password) =>
    fetch(`${API_URL}/auth/register`, { method: 'POST', headers: headers(false), body: JSON.stringify({ name, email, password }) }).then(r => r.json()),

  getMe: () =>
    fetch(`${API_URL}/auth/me`, { headers: headers() }).then(r => r.json()),

  // Batches
  getBatches: () =>
    fetch(`${API_URL}/batches`).then(r => r.json()),

  // Orders
  createOrder: (data) =>
    fetch(`${API_URL}/orders`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

  getOrders: (status) =>
    fetch(`${API_URL}/orders?status=${status || 'all'}`, { headers: headers() }).then(r => r.json()),

  approveOrder: (id) =>
    fetch(`${API_URL}/orders/${id}/approve`, { method: 'PUT', headers: headers() }).then(r => r.json()),

  rejectOrder: (id, note) =>
    fetch(`${API_URL}/orders/${id}/reject`, { method: 'PUT', headers: headers(), body: JSON.stringify({ note }) }).then(r => r.json()),

  // Modules
  getModules: () =>
    fetch(`${API_URL}/modules`).then(r => r.json()),

  getAllModules: () =>
    fetch(`${API_URL}/modules/all`, { headers: headers() }).then(r => r.json()),

  // Quizzes
  getActiveQuiz: () =>
    fetch(`${API_URL}/quizzes/active`, { headers: headers() }).then(r => r.json()),

  getMyAttempts: () =>
    fetch(`${API_URL}/quizzes/my-attempts`, { headers: headers() }).then(r => r.json()),

  submitQuiz: (quizId, answers) =>
    fetch(`${API_URL}/quizzes/submit`, { method: 'POST', headers: headers(), body: JSON.stringify({ quizId, answers }) }).then(r => r.json()),

  // Bookings
  getAvailableSlots: (date) =>
    fetch(`${API_URL}/bookings/available?date=${date}`).then(r => r.json()),

  createBooking: (date, time) =>
    fetch(`${API_URL}/bookings`, { method: 'POST', headers: headers(), body: JSON.stringify({ date, time }) }).then(r => r.json()),

  getMyBookings: () =>
    fetch(`${API_URL}/bookings/my`, { headers: headers() }).then(r => r.json()),

  // Tickets
  createTicket: (subject, message) =>
    fetch(`${API_URL}/tickets`, { method: 'POST', headers: headers(), body: JSON.stringify({ subject, message }) }).then(r => r.json()),

  getMyTickets: () =>
    fetch(`${API_URL}/tickets/my`, { headers: headers() }).then(r => r.json()),

  replyTicket: (id, text) =>
    fetch(`${API_URL}/tickets/${id}/message`, { method: 'POST', headers: headers(), body: JSON.stringify({ text }) }).then(r => r.json()),

  // Broadcasts (user)
  getLatestBroadcasts: () =>
    fetch(`${API_URL}/broadcasts/latest`, { headers: headers() }).then(r => r.json()),

  // Profile
  updateProfile: (data) =>
    fetch(`${API_URL}/users/profile`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

  // Admin
  getAllUsers: (search) =>
    fetch(`${API_URL}/users?search=${search || ''}`, { headers: headers() }).then(r => r.json()),

  getAdminOrders: (status) =>
    fetch(`${API_URL}/orders?status=${status || 'all'}`, { headers: headers() }).then(r => r.json()),

  getAllBroadcasts: () =>
    fetch(`${API_URL}/broadcasts`, { headers: headers() }).then(r => r.json()),

  createBroadcast: (data) =>
    fetch(`${API_URL}/broadcasts`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

  getAdminBookings: (date) =>
    fetch(`${API_URL}/bookings?date=${date || ''}`, { headers: headers() }).then(r => r.json()),

  confirmBooking: (id) =>
    fetch(`${API_URL}/bookings/${id}/confirm`, { method: 'PUT', headers: headers() }).then(r => r.json()),

  cancelBooking: (id) =>
    fetch(`${API_URL}/bookings/${id}/cancel`, { method: 'PUT', headers: headers() }).then(r => r.json()),

  // Admin booking management
  rescheduleBooking: (id, date, time) =>
    fetch(`${API_URL}/bookings/${id}/reschedule`, { method: 'PUT', headers: headers(), body: JSON.stringify({ date, time }) }).then(r => r.json()),

  blockDate: (date, note) =>
    fetch(`${API_URL}/bookings/block-date`, { method: 'POST', headers: headers(), body: JSON.stringify({ date, note }) }).then(r => r.json()),

  unblockDate: (date) =>
    fetch(`${API_URL}/bookings/block-date/${date}`, { method: 'DELETE', headers: headers() }).then(r => r.json()),

  // Admin ticket management
  replyTicket: (id, text) =>
    fetch(`${API_URL}/tickets/${id}/message`, { method: 'POST', headers: headers(), body: JSON.stringify({ text }) }).then(r => r.json()),

  getTicketById: (id) =>
    fetch(`${API_URL}/tickets/${id}`, { headers: headers() }).then(r => r.json()),

  getBookingSlots: (date) =>
    fetch(`${API_URL}/bookings/slots${date ? `?date=${date}` : ''}`, { headers: headers() }).then(r => r.json()),

  setBookingSlots: (date, slots) =>
    fetch(`${API_URL}/bookings/slots`, { method: 'PUT', headers: headers(), body: JSON.stringify({ date, slots }) }).then(r => r.json()),

  getAdminTickets: () =>
    fetch(`${API_URL}/tickets`, { headers: headers() }).then(r => r.json()),

  closeTicket: (id) =>
    fetch(`${API_URL}/tickets/${id}/close`, { method: 'PUT', headers: headers() }).then(r => r.json()),

  setUserRole: (userId, role, durationDays) =>
    fetch(`${API_URL}/users/${userId}/role`, { method: 'PUT', headers: headers(), body: JSON.stringify({ role, durationDays }) }).then(r => r.json()),

  extendUserRole: (userId, days) =>
    fetch(`${API_URL}/users/${userId}/extend`, { method: 'PUT', headers: headers(), body: JSON.stringify({ days }) }).then(r => r.json()),

  // Accounts
  getAccounts: () =>
    fetch(`${API_URL}/accounts`, { headers: headers() }).then(r => r.json()),
  createAccount: (data) =>
    fetch(`${API_URL}/accounts`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  updateAccount: (id, data) =>
    fetch(`${API_URL}/accounts/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  deleteAccount: (id) =>
    fetch(`${API_URL}/accounts/${id}`, { method: 'DELETE', headers: headers() }).then(r => r.json()),

  // Journal
  getJournal: (params) => {
    const q = new URLSearchParams(params || {}).toString();
    return fetch(`${API_URL}/journal?${q}`, { headers: headers() }).then(r => r.json());
  },
  createJournalEntry: (data) =>
    fetch(`${API_URL}/journal`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  updateJournalEntry: (id, data) =>
    fetch(`${API_URL}/journal/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  deleteJournalEntry: (id) =>
    fetch(`${API_URL}/journal/${id}`, { method: 'DELETE', headers: headers() }).then(r => r.json()),
  getJournalStats: (accountId) =>
    fetch(`${API_URL}/journal/stats${accountId ? `?accountId=${accountId}` : ''}`, { headers: headers() }).then(r => r.json()),
};

export default api;
