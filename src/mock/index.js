import Mock from 'mockjs'

// 这是一个模拟接口的文件,所有的数据通过json在此引入,通过mock的形式
const Menu = require('./menu.json'); 

Mock.mock('/api/users/menus','get',Menu)