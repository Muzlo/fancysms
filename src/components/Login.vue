<template>
  <div class="container-wrap">
    <canvas id="canvas"></canvas>
    <el-form class="login" :rules="rules" label-position="right" ref="loginForm" :model="form">

      <h3 class="title">用 户 登 录</h3>

      <el-form-item prop="userName"> 
        <el-input class="el-input" prefix-icon="el-icon-user-solid" v-model="form.userName" placeholder="用户名"></el-input>
      </el-form-item>

      <el-form-item prop="userPassword">
        <el-input class="el-input" type="password" prefix-icon="el-icon-lock" show-password v-model="form.userPassword" placeholder="密码"></el-input>
      </el-form-item>

      <el-form-item>
        <el-checkbox class="el-input" v-model="checked">记住密码</el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="loginBtn" @click="onSubmit('loginForm')">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "../api/api.js";
export default {
    name:"login",
    data() {
      return {
        form: {
          userName: '',
		  userPassword: '',
		  token:"111"
        },
        checked: false,
        rules:{
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          userPassword: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    created(){
      let isHave=localStorage.getItem("userLoginInfo")
      if(isHave!=null){
        this.form=JSON.parse(isHave)
      }
      this.checked= localStorage.getItem("userLoginChecked")=="false||null"?false:true;
    },
    mounted(){
      this.canvasFn()
    },
    methods: {
      onSubmit(form) {
        localStorage.setItem('userLoginChecked',JSON.stringify(this.checked));
        if(this.checked){
          localStorage.setItem('userLoginInfo',JSON.stringify(this.form));
        }
        this.$refs[form].validate((valid) => {
          if (valid) {
             this.loginFn();
          } else {
            return false;
          }
        });
      },
      async loginFn(){
        const data=await this.$axios.post(login,this._qs.stringify(this.form) );
        try {
            if(data.status==0){
			  localStorage.setItem('fancysmsToken', data.data);
			  this.$router.push({ path: this.redirect || '/' }, onComplete => { }, onAbort => { })
			  
            }else{
              this.$message.error(data.message);
            }
        } catch (err) {
            console.log(err);
            this.$message.error("服务器异常，请稍后再试！");
        }


      },
      canvasFn(){
		var canvas,
			ctx,
			width,
			height,
			size,
			lines,
			tick;

		function line() {
			this.path = [];
			this.speed = rand(10, 20);
			this.count = randInt(10, 30);
			this.x = width / 2, +1;
			this.y = height / 2 + 1;
			this.target = {
				x: width / 2,
				y: height / 2
			};
			this.dist = 0;
			this.angle = 0;
			this.hue = tick / 5;
			this.life = 1;
			this.updateAngle();
			this.updateDist();
		}

		line.prototype.step = function(i) {
			this.x += Math.cos(this.angle) * this.speed;
			this.y += Math.sin(this.angle) * this.speed;
			this.updateDist();
			if (this.dist < this.speed) {
				this.x = this.target.x;
				this.y = this.target.y;
				this.changeTarget();
			}
			this.path.push({
				x: this.x,
				y: this.y
			});
			if (this.path.length > this.count) {
				this.path.shift();
			}
			this.life -= 0.001;
			if (this.life <= 0) {
				this.path = null;
				lines.splice(i, 1);
			}
		};

		line.prototype.updateDist = function() {
			var dx = this.target.x - this.x,
				dy = this.target.y - this.y;
			this.dist = Math.sqrt(dx * dx + dy * dy);
		}

		line.prototype.updateAngle = function() {
			var dx = this.target.x - this.x,
				dy = this.target.y - this.y;
			this.angle = Math.atan2(dy, dx);
		}

		line.prototype.changeTarget = function() {
			var randStart = randInt(0, 3);
			switch (randStart) {
				case 0: // up
					this.target.y = this.y - size;
					break;
				case 1: // right
					this.target.x = this.x + size;
					break;
				case 2: // down
					this.target.y = this.y + size;
					break;
				case 3: // left
					this.target.x = this.x - size;
			}
			this.updateAngle();
		};

		line.prototype.draw = function(i) {
			ctx.beginPath();
			var rando = rand(0, 10);
			for (var j = 0, length = this.path.length; j < length; j++) {
				ctx[(j === 0) ? 'moveTo' : 'lineTo'](this.path[j].x + rand(-rando, rando), this.path[j].y + rand(-rando, rando));
			}
			ctx.strokeStyle = 'hsla(' + rand(this.hue, this.hue + 30) + ', 80%, 55%, ' + (this.life / 3) + ')';
			ctx.lineWidth = rand(0.1, 2);
			ctx.stroke();
		};

		function rand(min, max) {
			return Math.random() * (max - min) + min;
		}

		function randInt(min, max) {
			return Math.floor(min + Math.random() * (max - min + 1));
		};

		function init() {
			canvas = document.getElementById('canvas');
			ctx = canvas.getContext('2d');
			size = 30;
			lines = [];
			reset();
			loop();
		}

		function reset() {
			width = Math.ceil(window.innerWidth / 2) * 2;
			height = Math.ceil(window.innerHeight / 2) * 2;
			tick = 0;

			lines.length = 0;
			canvas.width = width;
			canvas.height = height;
		}

		function create() {
			if (tick % 10 === 0) {
				lines.push(new line());
			}
		}

		function step() {
			var i = lines.length;
			while (i--) {
				lines[i].step(i);
			}
		}

		function clear() {
			ctx.globalCompositeOperation = 'destination-out';
			ctx.fillStyle = 'hsla(0, 0%, 0%, 0.1';
			ctx.fillRect(0, 0, width, height);
			ctx.globalCompositeOperation = 'lighter';
		}

		function draw() {
			ctx.save();
			ctx.translate(width / 2, height / 2);
			ctx.rotate(tick * 0.001);
			var scale = 0.8 + Math.cos(tick * 0.02) * 0.2;
			ctx.scale(scale, scale);
			ctx.translate(-width / 2, -height / 2);
			var i = lines.length;
			while (i--) {
				lines[i].draw(i);
			}
			ctx.restore();
		}

		function loop() {
			requestAnimationFrame(loop);
			create();
			step();
			clear();
			draw();
			tick++;
		}

		function onresize() {
			reset();
		}

		window.addEventListener('resize', onresize);

		init();


      }

    }
  }
</script>

<style scoped>
	canvas { position: absolute; top: 0; left: 0; }
	.container-wrap{
		height: 100%;
		background:#000; 
		/* //#409EFF */
	}
	.login{
		border-radius: 10px;
		padding:30px 50px 20px 50px;
		background: rgba(2, 2, 2, 0.5);
		box-shadow: 0 0 10px #fff;
		width:250px;
		position: absolute;
		left:50%;
		top: 50%;
		transform: translate(-50%,-50%);
	}
	.title{
		font-size: 20px;
		color: #ffffff;
		text-align:center;
		margin-bottom: 20px;
	}
	.container-wrap >>> .loginBtn{
		width:100%;
		background-color: rgba(44, 42, 42, 0.5);
		border-color:  #fff
	}
	.container-wrap >>> .el-input input {
		background-color:rgba(2, 2, 2, 0.5);
		color: #fff; 
	}
	.container-wrap >>> .el-input .el-checkbox__inner{
		background-color: #040404;
	}
	.container-wrap >>> .el-input .el-checkbox__label{
		color: #cecece;
	}

</style>
