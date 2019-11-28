//<div id="dview" v-show='posts.length>0'>
//<dpost v-for="p in posts" v-bind:post="p" v-bind:pid="p.id"></dpost>
//</div>

initialize('id', 'key');

Vue.component('dpost', {
  props: ['post','pid'],
  template: '<div class="row w3-border-bottom"><a href={{pid}}><h2 class="post-title"> {{post.title}}</h2> 	</a><div><a href="{{post.link}}"><div class="post-content-preview">{{post.digest}}</div></a><p class="post-meta" style="margin: 10px 0;"> Posted by JunMing on {{post.date}}</p><div class="tags"><a class="w3-aqua w3-hover-light-blue" v-for="tag in post.tags" href="/tags/#{{tag}}" title="{{tag}}">{{tag}}</a></div></div></div>'
})

let dv = new Vue({
   el:'#dview',
   data:{
       posts:[
       {title:'tile of post',
       link:'link of f post',
       digest:'sum of post',
       tags:['tag1','tag2','tag3'],
       date:'2019-11-27'}
       ]
   }
});
getPosts();
function getPosts()
{
    findItemsEqualTo('NEWPOSTS', 'mode', 1, function(tname,results)
    {
        for(let i=0;i<results.length;i++)
        {
           let pd = {};
           pd.title = results[i].get('title');
           pd.digest= results[i].get('mdcontent').slice(1,100);
           pd.tags = results[i].get('tags');
           pd.link = 'showdpost.html?'+results[i].id;
           pd.date = '';//convert from createat;
           dv.posts.push(pd);
        }
    },
    function(tname,error)
    {
    }
    )
}