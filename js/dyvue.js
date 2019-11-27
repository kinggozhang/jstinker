Vue.component('dpost', {
  props: ['post'],
  template: '<div class="row w3-border-bottom"><a href="{{post.link}}"><h2 class="post-title"> {{post.title}}</h2> 	</a><div><a href="{{post.link}}"><div class="post-content-preview">{{post.digest}}</div></a><p class="post-meta" style="margin: 10px 0;"> Posted by JunMing on {{post.date}}</p><div class="tags"><a class="w3-aqua w3-hover-light-blue" v-for="tag in post.tags" href="/tags/#{{tag}}" title="{{tag}}">{{tag}}</a></div></div></div>'
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

function getPosts()
{
    
}