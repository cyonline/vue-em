<template>
  <div id="personLookboard">
    <main class="main">
      <header class="lookboard_panel_header">
        <div class="float-left header-title">个人看板</div>
      </header>
      <div class="lookboard_panel_header_blank"></div>
      <article ref="mainContent" class="lookboard_panel_content">
        <div class="box">
          <div class="left-side">
            <div class="avator"></div>
            <div class="username">{{ userName }}</div>
            <div class="userType">{{ userType }}</div>
          </div>
          <div class="right-side">
            <div class="form-box">
              <el-form
                ref="userForm"
                v-model="userInfo"
                label-width="80px"
                size="small"
                label-position="top"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input
                    v-model="userInfo.name"
                    placeholder="请输入用户名"
                  ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input
                    v-model="userInfo.email"
                    placeholder="example@163.com"
                  ></el-input>
                </el-form-item>
                <el-form-item label="个人简介" prop="intro">
                  <el-input
                    type="textarea"
                    v-model="userInfo.intro"
                    height="80px"
                    placeholder="请输入个人简介"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    size="mimedium"
                    @click="submitForm('userForm')"
                    >更新</el-button
                  >
                  <!-- <el-button @click="resetForm('userForm')">重置</el-button> -->
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </article>
    </main>
  </div>
</template>

<script>
export default {
  name: "personalLookBoard",
  data: function () {
    return {
      userInfo: {},
      userName: "",
      userType: "",
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getUserInfo() {
      let params = {
        userId: localStorage.getItem("userid"),
      };
      this.$http.get("/user/userInfo", params).then((res) => {
        if (res.code == 200) {
          console.info(res.data);
          this.userInfo.name = res.data.name;
          this.userInfo.email = res.data.email;
          this.userType = res.data.userType==0?'超级管理员':'普通用户';
          this.userName = res.data.name;
          this.userInfo.intro = res.data.intro;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    updateUserInfo() {
      let params = {};
      this.$http.put("/user/userInfo", params).then((res) => {});
    },
  },
  created() {},
  mounted() {
    this.getUserInfo();
  },
};
</script>

<style lang="less" scoped>
#personLookboard {
  width: 100%;
  height: 100%;
  .lookboard_panel_content {
    padding: 15px;
    .box {
      width: 100%;
      height: 100%;
      display: flex;
      background: #fff;
      border-radius: 5px;
      padding: 40px 0;
      .left-side {
        width: 35%;
        border-right: 1px solid #efeff4;
        overflow: auto;
        .avator {
          @circleSize: 150px;
          width: @circleSize;
          height: @circleSize;
          border-radius: 50%;
          box-shadow: 0px 0px 10px -5px #000;
          margin: 100px auto 40px;
        }
        .username {
          text-align: center;
          font-size: 22px;
          margin: 20px 0;
        }
        .userType {
          text-align: center;
          font-size: 18px;
          color: #ddd;
          margin: 20px 0;
        }
      }
      .right-side {
        width: 65%;
        padding: 20px;
        .form-box {
          width: 400px;
          /deep/ .el-textarea__inner {
            height: 80px;
          }
        }
      }
    }
  }
}
</style>
