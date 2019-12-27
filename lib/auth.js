module.exports = {
    isOwner:function(request, response) {
        if (request.user) { //requset에 user라는 것이 있느면 true가 된다
            return true;
        } else {
            return false;
        }
    },
    statusUI:function(request, response) {
        var authStatusUI = '<a href="/auth/login">login</a>'
        if (this.isOwner(request, response)) { //true일 경우 authStatusUI라는게 nickname이랑 로그아웃으로 바뀜
            authStatusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`;
        }
        return authStatusUI;
    }
}