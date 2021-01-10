<template>
    <div class="wrap">
        <p>当前选择：
            <Tag v-for="(item,index) in nowchoose_check" :key="index">
                {{item}}
            </Tag>
        </p>
        <Tree :data="Treedata" :load-data="loadData" show-checkbox
        @on-check-change="checkchange_nowchoose">

        </Tree>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        created(){
            axios.get('http://127.0.0.1:3000/api').then(data => {
                // item：{"quyuID":"010","quyuName":"上海分公司"}
                this.Treedata = data.data.arr.map(item => ({
                    title:item.quyuName,
                    quyuID:item.quyuID,
                    floor:1,
                    loading:false,
                    children:[],
                }))
            })
        },
        data() {
            return {
                Treedata: [],
                nowchoose:[]
            }
        },
        computed:{
            nowchoose_check(){
                for(let i = 0; i<this.nowchoose.length; i++){
                    if(this.nowchoose[i].floor == 1){
                        for(let j = 0; j<this.nowchoose.length; j++){
                            if(this.nowchoose[j].belongqID == this.nowchoose[i].quyuID){
                                this.nowchoose.splice(j,1)
                                j--;
                            }
                        }
                        
                    }
                }
                for(let i = 0; i<this.nowchoose.length; i++){
                    if(this.nowchoose[i].floor == 2){
                       //注意：这里不能用filter方法，因为会使同层级之间相互影响，而不能使勾选的全部显示在页面上
                       for(let j = 0; j<this.nowchoose.length; j++){
                           if(this.nowchoose[j].belongbID == this.nowchoose[i].bumenID){
                               this.nowchoose.splice(j,1)
                               j--;
                           }
                       }
                    }
                }

                return this.nowchoose.map(item => {
                    if(item.floor == 1){
                        return item.title + '全体成员'
                    }else if(item.floor == 2){
                        return item.belongqname + item.title
                    }else if(item.floor == 3){
                        return item.title + '(' + item.belongqname + item.belongbname +')'
                    }
                })
            }
                
        },
        methods:{
            loadData(item, callback){
                if(item.floor == 1){
                //item：{ children: Array(5)
                          //loading: true
                          //nodeKey: 0
                          //quyuID: "010"
                          //floor:1
                          //title: "上海分公司" }
                    axios.get('http://127.0.0.1:3000/api?m=' + item.quyuID).then(data => {
                        //_item：{"bumenID":"0101","bumenName":"人资部"}
                        callback(data.data.arr.map(_item => ({
                            //当前部门的名字
                            title:_item.bumenName,
                            //当前部门的ID
                            bumenID:_item.bumenID,
                            //当前层级
                            floor:2,
                            //所属区域的名字
                            belongqname:item.title,
                            //所属区域的ID
                            belongqID:item.quyuID,
                            loading:false,
                            children:[]
                        })))
                    });
                }else if(item.floor == 2){
                //item(children)：{ children: Array(0)
                          //loading: true
                          //nodeKey: 1
                          //bumenID: "0101"
                          //floor:2
                          //title: "人资部" }
                    axios.get('http://127.0.0.1:3000/api?m=' + item.bumenID).then(data => {
                        //_item：{"renID":"01011","Name":"小明"}
                        callback(data.data.arr.map(_item => ({
                            //人名
                            title:_item.Name,
                            //人名ID
                            renID:_item.renID,
                            //当前层级
                            floor:3,
                            //所属区域的名字
                            belongqname:item.belongqname,
                            //所属部门的名字
                            belongbname:item.title,
                            //所属部门的ID
                            belongbID:item.bumenID
                        })))
                    })
                }
                
            },
            checkchange_nowchoose(nowcheck){
                // console.log(nowcheck)
                //nowcheck.item：{ //belongqname:"上海分公司"
                                   //belongqID: "010"
                                   //bumenID: "0101"
                                   //checked: true
                                   //children: Array(0)
                                   //floor: 2
                                   //loading: false
                                   //nodeKey: 1
                                   //title: "人资部" } 
                this.nowchoose = nowcheck;
            }
        }
    }
</script>

<style lang="less" scoped>
    .wrap{
        width: 800px;
        margin: 80px auto;
    }
</style>