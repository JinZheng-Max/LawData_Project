// auth.js - 仅包含登录状态检测功能

// 检查登录状态的函数
function checkLoginStatus() {
    // 三重验证机制
    const urlParams = new URLSearchParams(window.location.search);
    return (
        urlParams.get('loggedIn') === 'true' ||
        localStorage.getItem('isLoggedIn') === 'true' ||
        sessionStorage.getItem('isLoggedIn') === 'true'
    );
}

// 初始化登录状态检测
function initAuthCheck() {
    // 获取所有入口按钮
    const entryButtons = document.querySelectorAll('.entry-btn');
    
    entryButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            if (!checkLoginStatus()) {
                event.preventDefault();// 阻止默认跳转
                event.stopPropagation(); // 阻止事件冒泡
                event.stopImmediatePropagation(); //阻止其他处理函数
                
                // 用户反馈
                if(confirm('请先登录系统，是否立即前往登录？')) {
                    window.location.href = 'login.html';
                }
            }
            // 已登录状态不做处理，允许正常跳转
        });
        
        // 双重保障：对于不支持JS的情况保留href
        button.setAttribute('data-original-href', button.getAttribute('href'));
        if(!checkLoginStatus()) {
            button.setAttribute('href', 'javascript:void(0)');
        }
    });
    
    // 根据登录状态显示/隐藏登录/退出按钮
    const loginBtn = document.querySelector('.login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (checkLoginStatus()) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
    
    // 退出按钮点击事件
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.setItem('isLoggedIn', 'false');
            window.location.href = 'login.html';
        });
    }
}

// 页面加载完成后初始化登录检测
document.addEventListener('DOMContentLoaded', initAuthCheck);