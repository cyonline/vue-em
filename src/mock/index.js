import Mock from 'mockjs'

import Menu from './menu'

Mock.mock('/api/users/menus','get',Menu.data)