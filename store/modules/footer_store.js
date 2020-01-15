export default {
	state: {
		footer_nav: [{
				"pagePath": "pages/tabbar/index/index",
				"icon": "/static/tabbar/index.png",
				"select_icon": "/static/tabbar/index1.png",
				"name": "首页",
				"name_code": 'home',
				"size":"small"
			},
			{
				"pagePath": "pages/shopMall/category/category",
				"icon": "/static/tabbar/master.png",
				"select_icon": "/static/tabbar/master1.png",
				"name": "商品分类",
				"name_code": 'goods_type_select',
				"size":"small"
			},
			{
				"pagePath": "pages/tabbar/home/home",
				"icon": "/static/tabbar/home.png",
				"select_icon": "/static/tabbar/home1.png",
				"name": "我",
				"name_code": 'my',
				"size":"small"
			}
		],
		now_page_index: 0,
	},
	mutations: {
		change_nav_list(state, data) {
			state.footer_nav = data;
		},
		change_page(state, index) {
			state.now_page_index = index;
		}
	},
	actions: {
		shopperMenu(ctx) {
			let menu_list = [{
					"pagePath": "pages/tabbar/index/index",
					"icon": "static/tabbar/index.png",
					"select_icon": "static/tabbar/index1.png",
					"name": "首页",
					"name_code": 'home',
					"size":"small"
				},
				{
					"pagePath": "pages/shopMall/category/category",
					"icon": "static/tabbar/master.png",
					"select_icon": "static/tabbar/master1.png",
					"name": "商品分类",
					"name_code": 'goods_type_select',
					"size":"small"
				},
				{
					"pagePath": "pages/tabbar/master/master",
					"icon": "static/tabbar/master.png",
					"select_icon": "static/tabbar/master1.png",
					"name": "任务列表",
					"name_code": 'task_list',
					"size":"small"
				},
				{
					"pagePath": "pages/tabbar/home/home",
					"icon": "static/tabbar/home.png",
					"select_icon": "static/tabbar/home1.png",
					"name": "我",
					"name_code": 'my',
					"size":"small"
				}
			]
			ctx.commit("change_nav_list", menu_list)
		}
	}
}
