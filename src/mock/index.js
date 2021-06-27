import Mock from 'mockjs'

const Menu = require('./menu.json'); 

Mock.mock('/api/users/menus','get',Menu)