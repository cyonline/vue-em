import Mock from 'mockjs'
import lookBoardData from './lookBoardData.js'
import Menu from './menu.js'
// 这是一个模拟接口的文件,所有的数据通过json在此引入,通过mock的形式
// const Menu = require('./menu'); 
const Image = require('./image.json'); 
// 菜单
Mock.mock('/api/users/menus','get',Menu)
// 图片
Mock.mock('/api/project/images','get',Image)
// 区域巡检range-check
Mock.mock('/api/engineeringReportBoard/areaQualityInspection','get',lookBoardData.rangCheckData)
Mock.mock('/api/engineeringReportBoard/groupQualityInspection','get',lookBoardData.groupInspectionData)
Mock.mock('/api/engineeringReportBoard/thirdParityAssess','get',lookBoardData.thirdParityAssessData)
Mock.mock('/api/engineeringReportBoard/milestoneNodeInfo','get',lookBoardData.milestoneNodeInfoData)
Mock.mock('/api/engineeringReportBoard/projectInfo','get',lookBoardData.projectInfoData)
// 计划节点
Mock.mock('/api/engineeringReportBoard/milestoneNode','get',lookBoardData.milestoneNodeData)