// Функция для определения мобильного устройства с улучшенной логикой
function isMobileDevice() {
    // Точное определение мобильного устройства по разным признакам
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // 1. Проверка по User Agent (самый надежный метод)
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|mobile|CriOS/i;
    const isMobileByAgent = mobileRegex.test(userAgent);
    
    // 2. Проверка ширины экрана
    const isMobileByWidth = window.innerWidth <= 768;
    
    // 3. Проверка наличия тачскрина
    const hasTouchScreen = ('ontouchstart' in window) || 
                           (navigator.maxTouchPoints > 0) || 
                           (navigator.msMaxTouchPoints > 0);
    
    // 4. Проверка по соотношению сторон и ориентации
    const isPortrait = window.innerHeight > window.innerWidth;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const isMobileRatio = aspectRatio < 1.2;
    
    // 5. Проверка настоящих десктопных сигналов
    const desktopIndicators = (navigator.platform && 
        (/Win32|Win64|MacIntel|Linux x86|Linux i686|Linux x86_64/i.test(navigator.platform)) &&
        !hasTouchScreen && 
        window.innerWidth > 1024);
    
    // Если явно определен десктоп и экран достаточно большой, это не мобильное устройство
    if (desktopIndicators) {
        return false;
    }
    
    // Применяем комбинированное определение
    // Устройство считается мобильным, если:
    // - Определено по юзер-агенту как мобильное ЛИБО
    // - Маленький экран И (тачскрин ИЛИ мобильное соотношение)
    return isMobileByAgent || (isMobileByWidth && (hasTouchScreen || (isPortrait && isMobileRatio)));
}

// Сохранение истории перенаправлений для предотвращения зацикливания
let redirectCount = 0;
const MAX_REDIRECTS = 2;

// Функция для перенаправления на мобильную версию
function redirectToMobile() {
    if (redirectCount >= MAX_REDIRECTS) {
        console.log("Достигнут лимит перенаправлений, отмена автоматического перенаправления");
        return false;
    }
    
    redirectCount++;
    
    if (isMobileDevice()) {
        console.log("Определено мобильное устройство, выполняется перенаправление...");
        
        // Получаем текущий URL
        let currentPath = window.location.pathname;
        let filename = currentPath.split('/').pop() || 'index.htm'; // Если путь пустой, считаем что это index.htm
        
        // Обрабатываем случай когда в URL нет имени файла (папка)
        if (!filename.includes('.htm')) {
            filename = 'index.htm';
        }
        
        // Проверяем, не находимся ли мы уже на мобильной версии
        if (!filename.includes('mobile_')) {
            // Определяем, какую мобильную страницу открыть
            let mobilePath = '';
            
            if (filename === '' || filename === 'index.htm') {
                mobilePath = 'mobile_index.htm';
            } else if (filename === 'index_d.htm') {
                mobilePath = 'mobile_index_d.htm';
            } else if (filename.includes('_d.htm')) {
                mobilePath = 'mobile_' + filename;
            } else {
                mobilePath = 'mobile_' + filename;
            }
            
            // Добавляем параметры для предотвращения зацикливания
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('device_type', 'mobile');
            urlParams.set('redirect_count', redirectCount.toString());
            
            // Перенаправляем на мобильную версию
            window.location.href = mobilePath + (urlParams.toString() ? '?' + urlParams.toString() : '');
            return true;
        }
    }
    
    return false;
}

// Функция для перенаправления на десктопную версию
function redirectToDesktop() {
    if (redirectCount >= MAX_REDIRECTS) {
        console.log("Достигнут лимит перенаправлений, отмена автоматического перенаправления");
        return false;
    }
    
    redirectCount++;
    
    if (!isMobileDevice()) {
        console.log("Определено десктопное устройство, выполняется перенаправление...");
        
        // Получаем текущий URL
        let currentPath = window.location.pathname;
        let filename = currentPath.split('/').pop() || 'mobile_index.htm';
        
        // Проверяем, находимся ли мы на мобильной версии
        if (filename.includes('mobile_')) {
            // Определяем, какую десктопную страницу открыть
            let desktopPath = filename.replace('mobile_', '');
            
            // Добавляем параметры для предотвращения зацикливания
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('device_type', 'desktop');
            urlParams.set('redirect_count', redirectCount.toString());
            
            // Перенаправляем на десктопную версию
            window.location.href = desktopPath + (urlParams.toString() ? '?' + urlParams.toString() : '');
            return true;
        }
    }
    
    return false;
}

// Проверка уже существующих параметров в URL для предотвращения зацикливания
function checkRedirectParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const storedCount = urlParams.get('redirect_count');
    
    if (storedCount) {
        redirectCount = parseInt(storedCount, 10);
        
        // Если уже произошло максимальное число перенаправлений, не делаем больше ничего
        if (redirectCount >= MAX_REDIRECTS) {
            console.log("URL указывает на достижение лимита перенаправлений, не предпринимаем действий");
            return false;
        }
    }
    
    // Проверка типа устройства в URL
    const deviceType = urlParams.get('device_type');
    const currentPath = window.location.pathname;
    
    // Если URL указывает, что мы на мобильной версии, но путь не содержит mobile_
    if (deviceType === 'mobile' && !currentPath.includes('mobile_')) {
        console.log("Несоответствие: устройство мобильное, но страница не мобильная");
        return true;
    }
    
    // Если URL указывает, что мы на десктопной версии, но путь содержит mobile_
    if (deviceType === 'desktop' && currentPath.includes('mobile_')) {
        console.log("Несоответствие: устройство десктопное, но страница мобильная");
        return true;
    }
    
    return true;
}

// Запускаем перенаправление при загрузке страницы
window.addEventListener('DOMContentLoaded', function() {
    // Проверяем параметры URL
    if (!checkRedirectParams()) {
        return;
    }
    
    console.log("Начинаем определение типа устройства...");
    const isMobile = isMobileDevice();
    console.log("Определен тип устройства: " + (isMobile ? "мобильное" : "десктопное"));
    
    const currentPath = window.location.pathname;
    const isMobilePage = currentPath.includes('mobile_');
    
    // Страница не соответствует устройству, выполняем перенаправление
    if (isMobile && !isMobilePage) {
        console.log("Обнаружено мобильное устройство на десктопной странице");
        redirectToMobile();
    } else if (!isMobile && isMobilePage) {
        console.log("Обнаружено десктопное устройство на мобильной странице");
        redirectToDesktop();
    } else {
        console.log("Устройство соответствует типу страницы, перенаправление не требуется");
    }
});

// Обработка изменения размера окна
let resizeTimer;
window.addEventListener('resize', function() {
    // Используем debouncing для предотвращения частых перенаправлений
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        const isMobile = isMobileDevice();
        const currentPath = window.location.pathname;
        const isMobilePage = currentPath.includes('mobile_');
        
        // Страница не соответствует устройству после изменения размера, выполняем перенаправление
        if (isMobile && !isMobilePage) {
            redirectToMobile();
        } else if (!isMobile && isMobilePage) {
            redirectToDesktop();
        }
    }, 300); // Задержка для предотвращения частого срабатывания
}); 