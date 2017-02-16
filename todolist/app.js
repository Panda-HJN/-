import Vue from 'vue'
import AV from 'leancloud-storage'

let APP_ID = '8axnRtGoxCJhEzsvNPEAHnol-gzGzoHsz';
let APP_KEY = '0YH4XkYflb4CUPfA743TGj8G';
AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

var app = new Vue({
    el: '#app',
    data: {
        actionType: 'signUp',
        formData: {
            username: '',
            password: ''
        },
        newTodo: '',
        todoList: [],
        currentUser: null,
    },
    created: function() {

        this.currentUser = this.getCurrentUser() //查看当前用户是谁,或者是不是null
        this.fetchTodos() //vue 实例 建立完成后 获取 数据

    },
    methods: {
        addTodo: function() {
            console.log('添加成功')
            var time = new Date()
            this.todoList.push({
                title: this.newTodo,
                createdAt: new Date(),
                todoTime: time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + time.getDate() + '日 ' + time.getHours() + ':' + time.getMinutes(), //建立时间
                done: false // done 表示 已完成还是未完成
            })
            this.newTodo = ''
            this.saveOrUpdateTodos() //每次修改后 都这行这个
        },
        removeTodo: function(todo) {
            console.log(todo)
            let index = this.todoList.indexOf(todo)
            console.log(index)
            this.todoList.splice(index, 1)
            this.saveOrUpdateTodos()
        },
        doneTodo: function(todo) {

            //!!!!点击多选框这个行为本身就已经修改了一次 done的状态了!!!
            //所以这里只需要保存并更新就好了
            this.saveOrUpdateTodos()
        },
        signUp: function() {
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
            }, (error) => {
                alert('注册失败')
                console.log(error)
            });
        },
        login: function() {
            AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
                this.fetchTodos() // 登录成功后读取 todos
            }, function(error) {
                alert('登录失败')
                console.log(error)
            });
        },
        getCurrentUser: function() {
            let current = AV.User.current()
            if (current) {
                let { id, createdAt, attributes: { username } } = current
                // 上面这句话看不懂就得看 MDN 文档了
                // 我的《ES 6 新特性列表》里面有链接：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
                return { id, username, createdAt } // 看文档：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#ECMAScript_6%E6%96%B0%E6%A0%87%E8%AE%B0
            } else {
                return null
            }
        },
        logout: function() {
            AV.User.logOut()
            this.currentUser = null
            window.location.reload()
        },
        fetchTodos: function() {
            if (this.currentUser) {
                var query = new AV.Query('AllTodos');
                query.find()
                    .then((todos) => {
                        let avAllTodos = todos[0]
                        let id = avAllTodos.id
                        this.todoList = JSON.parse(avAllTodos.attributes.content)
                        this.todoList.id = id // 每个todolist 都是有ID的
                    }, function(error) {
                        console.error(error)
                    })
            }
        },
        updateTodos: function() {
            let dataString = JSON.stringify(this.todoList)
            let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
            avTodos.set('content', dataString)
            avTodos.save().then(() => {
                console.log('更新成功')
            })
        },
        saveTodos: function() {
            let dataString = JSON.stringify(this.todoList)
            var AVTodos = AV.Object.extend('AllTodos')
            var avTodos = new AVTodos();
            var acl = new AV.ACL()
            acl.setReadAccess(AV.User.current(), true) // 指定 user 
            acl.setWriteAccess(AV.User.current(), true) //

            avTodos.set('content', dataString);
            avTodos.setACL(acl)
            avTodos.save().then((todo) => {
                this.todoList.id = todo.id // id必须 挂到 this.todoList 上!!!!!
                console.log('保存成功');
            }, function(error) {
                alert('保存失败');
            });
        },
        saveOrUpdateTodos: function() {
            if (this.todoList.id) {
                this.updateTodos()
            } else {
                this.saveTodos()
            }
        }
    }
})