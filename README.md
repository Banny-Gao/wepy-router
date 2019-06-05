## Wepy-router ![](https://img.shields.io/badge/wepy-router-orange.svg)



### Install
  ``` javascript
  npm i wepy --save
  ```  
### Config & Init
  **app.wepy**  
  ``` javascript
  import Router from 'wepy-router'  
  const config = {
    pages: ['pages/index'],
    subPackages: [
      {
        root: 'pages/common',
        pages: ['a', 'b']
      },
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'xxx',
      navigationBarTextStyle: 'black'
    }
  }
  export default class extends wepy.app {
    config = config;
    router = new Router(config);
    globalData = {};
    constructor() {
      super()
      this.use('requestfix') 
    }
    onLaunch() {
      console.log(wepy.$router)
    }
  }
  ```
### Useing in page or component   
  **[default navigate]**    
  ``` javascript
  wepy.$router.push('/pages/common/a', {
    id: 1
  })
  ```
  or    
  ``` javascript
  wepy.$router.push({
    path: '/pages/common/a',
    query: {
      id: 1
    }
  })
  ```   
    **[reLaunch]**   
  ``` javascript
  wepy.$router.push({
    path: '/pages/common/b',
    relaunch: true
  })
  ```  
    or  
  ``` javascript
  wepy.$router.push(path: '/pages/common/a',{},true)
  ```
  **[navigate back or front]**   
  >back to last page  
  ``` javascript
  wepy.$router.go(-1)
  ```    
  go front  

  ``` javascript
  wepy.$router.go(1)
  ``` 
  >> you wouldn't be caring about if it should be switching tabbar   
  >> more than pages length have disposed

### More 
  >> if you want you this insdead of wepy.$router  
  _Doing this_   

  ``` javascript
  import { routerMinx } from 'wepy-router'  
  export default class Index extends wepy.page {
    mixins = [routerMinx]
    onLoad() {
      conosle.log(this.$router)
    }
  }
  ```   
  or  
  ``` javascript
  import {withRouter} from 'wepy-router'  
  @withRouter  
  export default class Index extends wepy.page {
    onLoad() {
      conosle.log(this.$router)
    }
  }
  ```
### License
  [MIT](https://opensource.org/licenses/MIT)
  



