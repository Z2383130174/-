/* 引入容器组件 */
import Home from "./component/Home/Home/index"    //登录主页面
// import List from './pages/admin/list/index'
import accountManagement from './pages/admin/accountManagement/index'
import Logging from './pages/admin/logging/index'
import auditLogging from './pages/admin/logging/audit'
import editLogging from './pages/admin/logging/edit'
// import DataBase from './pages/admin/database/index'
import DataBase from './pages/admin/database/editindex'  //富文本编辑器小bug
import userCircularize from './pages/admin/circularize/index'
import ChangeYear from './pages/admin/changeYear/index'
import Notice from './pages/admin/NewsConstruction/Notice/index'
import editNotice from './pages/admin/NewsConstruction/Notice/edit'
import auditNotice from './pages/admin/NewsConstruction/Notice/audit'
import News from './pages/admin/NewsConstruction/News/index'
import NewsDetails from './pages/admin/NewsConstruction/News/newsDetail/index'
import Publicity from './pages/admin/NewsConstruction/publicity/index'
import Detail from './pages/admin/NewsConstruction/publicity/details/index'
import Information from './pages/admin/NewsConstruction/information/index'
import editInformation from './pages/admin/NewsConstruction/information/edit'
import auditInformation from './pages/admin/NewsConstruction/information/audit'
import TaskManagement from './pages/admin/Work/taskManagement/index'
import editTaskManagement from './pages/admin/Work/taskManagement/edit'
import Forum from './pages/admin/Work/forum/index'
import QuestionnaireSurvey from './pages/admin/Work/QuestionnaireSurvey/index'
import LeagueActivities from './pages/admin/ActivityRecord/LeagueActivities/index'
import LeagueActivitiesEdit  from'./pages/admin/ActivityRecord/LeagueActivities/edit/index'
import ClassInformation from './pages/admin/ActivityRecord/classInformation/index'
import editClassInformation from './pages/admin/ActivityRecord/classInformation/edit/index'
import pageNotFound  from './pages/pageNotFound'
/* 路由配置 */
export const homeRoutes = [{
    path: '/login',
    component:Home
}, {
     path: '/404',
     component:pageNotFound
}]
export const adminRoutes = [{
    //用户账号管理组件
    path: '/admin/accountManagement',
    component: accountManagement,
    isShow: true,
    title: '用户账号管理',
    icon:"iconyonghu"
    },
    {
        path: '/admin/logging',
        component: Logging,
        isShow: true,
        title: '日志记录', 
        icon:"iconjilu"
    },
    {
        path: '/admin/logging/edit',
        component: editLogging,
        isShow: false,
        title: '编辑日志记录', 
        icon:"iconjilu"
    },
    {
        path: '/admin/logging/audit',
        component: auditLogging,
        isShow: false,
        title: '审核日志记录', 
        icon:"iconjilu"
    },
    {
        path: '/admin/circularize',
        component: userCircularize,
        isShow: false,
        title: '通知中心', 
        icon:"iconjilu"
    },
    {
        path: '/admin/changeYear',
        component:ChangeYear ,
        isShow: true,
        title: '年度转接', 
        icon:"iconziyuan"
    },
        {
        path: '/admin/database',
        component: DataBase,
        isShow: false,
        title: '富文本编辑器小bug', 
        icon:"iconico_Mysgl"
    },
    // {
    //     path: '/admin/database',
    //     component: DataBase,
    //     isShow: true,
    //     title: '数据库管理', 
    //     icon:"iconico_Mysgl"
    // },
    {
     path: '/admin/NewsConstruction/details',
     component: Detail,
     isShow: false,
     title: '公示详情',
    },
    {
        path: '/admin/NewsConstruction/News/NewsDetails',
        component: NewsDetails,
        isShow: false,
        title: '新闻详情',
        icon:"iconxinwen",
    },
    {
        path: '/admin/NewsConstruction/notice/edit',
        component: editNotice,
        isShow: false,
        title: '公告详情',
        icon:"iconxinwen",
    },
    {
        path: '/admin/NewsConstruction/notice/audit',
        component: auditNotice,
        isShow: false,
        title: '审核公告',
        icon:"iconxinwen",
    },
      {
        path: '/admin/NewsConstruction',
        isShow: true,
        title: '团建要闻',
        icon:"iconzhongyuanyaowen",
        routes: [
            {
                path: '/admin/NewsConstruction/publicity',
                component: Publicity,
                isShow: true,
                title: '公示',
                icon:"icongongshi"
            },
            {
                path: '/admin/NewsConstruction/notice',
                component: Notice,
                isShow: true,
                title: '公告发布',
                icon:"iconfabu"
            },
            {
                path: '/admin/NewsConstruction/News',
                component: News,
                isShow: true,
                title: '国内外新闻',
                icon:"iconxinwen",
            },
            {
                path: '/admin/NewsConstruction/information',
                component: Information,
                isShow: true,
                title: '学校团委',
                icon:"iconzhongyaoxinxi",
            },
        ]
    },
    {
        path: '/admin/NewsConstruction/information/edit',
        component: editInformation,
        isShow: false,
        title: '编辑学校团委',
        icon:"iconrenwu",
    },   {
        path: '/admin/NewsConstruction/information/audit',
        component: auditInformation,
        isShow: false,
        title: '审核团委信息',
        icon:"iconrenwu",
    },
    {
        path: '/admin/Work/taskManagement/edit',
        component: editTaskManagement,
        isShow: false,
        title: '任务管理详情',
        icon:"iconrenwu",
    },
    {
        path: '/admin/Work',
        // component: Zhanghao,
        isShow: true,
        title: '团建办公',
        icon:"iconbangong",
        routes: [
            {
                path: '/admin/Work/taskManagement',
                component: TaskManagement,
                isShow: true,
                title: '任务管理',
                icon:"iconrenwu",
            },
            {
                path: '/admin/Work/forum',
                component: Forum,
                isShow: true,
                title: '团员论坛',
                icon:"iconluntan",
            },
            {
                path: '/admin/Work/QuestionnaireSurvey',
                component: QuestionnaireSurvey,
                isShow: true,
                title: '问卷调研',
                icon:"iconwenjuandiaoyan",
            },
        ]
    },
    {
        path: '/admin/ActivityRecord/LeagueActivities/edit',
        component: LeagueActivitiesEdit,
        isShow: false,
        title: '团日活动编辑',
        icon:"iconhuodong",
    },
    {
        path: '/admin/ActivityRecord/classInformation/edit',
        component: editClassInformation,
        isShow: false,
        title: '团课信息编辑',
        icon:"iconhuodong",
    },
    {
        path: '/admin/ActivityRecord',
        // component: Zhanghao,
        isShow: true,
        title: '活动记录',
        icon:"iconrecord",
        routes: [
            {
                path: '/admin/ActivityRecord/LeagueActivities',
                component: LeagueActivities,
                isShow: true,
                title: '团日活动',
                icon:"iconhuodong",
            },
           
            {
                path: '/admin/ActivityRecord/classInformation',
                component: ClassInformation,
                isShow: true,
                title: '团课信息',
                icon:"iconxinxi",
            },
        ]
    },
   
]