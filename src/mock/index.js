import Mock from 'mockjs'

// 这是一个模拟接口的文件,所有的数据通过json在此引入,通过mock的形式
const Menu = require('./menu.json'); 
const Image = require('./image.json'); 
// 菜单
Mock.mock('/api/users/menus','get',Menu)
// 图片
Mock.mock('/api/project/images','get',Image)