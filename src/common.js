import config from 'src/config.js'
let APP_EMAIL = 'support@siml.ph'
export default {
  sidebarMenu: [
    {accountType: 'ALL', showOnAdmin: true, accountStatus: 'ALL', description: 'Dashboard', icon: 'fa fa-home', path: 'dashboard', flag: false, subMenu: null},
    {accountType: 'ALL', showOnAdmin: true, accountStatus: 'ALL', description: 'Bookings', icon: 'fa fa-bookmark', path: 'bookings', flag: false, subMenu: null},
    {accountType: 'ADMIN', showOnAdmin: true, accountStatus: 'ADMIN', description: 'Accounts', icon: 'fa fa-users', path: 'accounts', flag: false, subMenu: null}
  ],
  menuOff: [
    {id: 1, users: 'ALL', parent_id: 0, description: 'Dashboard', icon: 'fa fa-tachometer', path: 'dashboard', flag: false, subMenu: null}
  ],
  APP_NAME: 'Mezzo Booking',
  APP_NAME_HTML: 'Mezzo Booking',
  APP_EMAIL: APP_EMAIL,
  APP_SITE: 'https://wearesiml.com',
  COMPANY: 'Mezzo',
  COMPANY_URL: 'http://wearesiml.ltd',
  COPYRIGHT: 'Mezzo ' + new Date().getFullYear(),
  USER_TYPE: [{
    title: 'USER'
  }],
  profileMenu: [
    {
      title: 'My Profile',
      icon: 'fa fa-cog',
      route: '/profile'
    }],
  USER_TYPE_SETTING: false,
  plan: false,
  broadcastingFlag: true,
  header: ['status', 'notification'], // 'messenger', '',
  settingsMenu: [
    {title: 'Profile', type: 'profile', allowed: ['cellular_number', 'address']},
    {title: 'Account', type: 'account', allowed: []},
    {title: 'Business Setting', type: 'merchant', allowed: ['prefix', 'website', 'address', 'schedule', 'information']}
  ]
}
