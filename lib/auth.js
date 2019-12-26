module.exports = {
    // 로그인 상태 체크 함수
    isOwner: function(req, res){
        if(req.session.isLogin){
            return {isLogin: true, userName: req.session.userName};
        }
        return {isLogin: false, userName: undefined};
    }
}