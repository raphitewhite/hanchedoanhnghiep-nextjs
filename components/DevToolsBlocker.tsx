"use client";

import { useEffect } from "react";

export default function DevToolsBlocker() {
  useEffect(() => {
    // Chỉ chạy trên desktop, không chạy trên mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768;

    if (isMobile) {
      return; // Không chạy trên mobile
    }

    let devtools = { open: false };
    const threshold = 160;

    // Disable right click
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts - cải thiện để chặn ngay cả khi đã bấm trước
    const preventKeyboard = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        e.keyCode === 123 || // F12 keyCode
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C" || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
        (e.ctrlKey && e.key === "U") ||
        (e.ctrlKey && e.keyCode === 85) ||
        (e.ctrlKey && e.shiftKey && e.key === "K") ||
        (e.ctrlKey && e.shiftKey && e.keyCode === 75)
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        // Chuyển hướng sang facebook.com
        window.location.href = "https://www.facebook.com";
        return false;
      }
    };

    // Phát hiện devtools bằng nhiều phương pháp
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      // Phương pháp 2: Kiểm tra console bằng cách đo thời gian
      let devtoolsOpen = false;
      const start = performance.now();
      // Sử dụng console.log để phát hiện devtools
      const element = new Image();
      Object.defineProperty(element, 'id', {
        get: function() {
          devtoolsOpen = true;
        }
      });
      console.log(element);
      console.clear();
      const end = performance.now();
      // Nếu console.log mất nhiều thời gian, có thể devtools đang mở
      const consoleSlow = end - start > 50;

      if (widthThreshold || heightThreshold || devtoolsOpen || consoleSlow) {
        if (!devtools.open) {
          devtools.open = true;
          // Clear console và hiển thị warning
          console.clear();
          console.log("%cStop!", "color: red; font-size: 50px; font-weight: bold;");
          console.log(
            "%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it is a scam and will give them access to your account.",
            "color: red; font-size: 16px;"
          );
          // Chuyển hướng sang facebook.com
          window.location.href = "https://www.facebook.com";
        }
      } else {
        devtools.open = false;
      }
    };

    // Chặn ngay từ đầu - thêm listener trước khi component mount
    const preventBeforeUnload = (e: BeforeUnloadEvent) => {
      // Không làm gì, chỉ để chặn
    };

    // Thêm event listeners với capture phase để chặn sớm hơn
    document.addEventListener("contextmenu", preventContextMenu, { capture: true });
    document.addEventListener("keydown", preventKeyboard, { capture: true, passive: false });
    window.addEventListener("beforeunload", preventBeforeUnload);

    // Kiểm tra ban đầu ngay lập tức
    checkDevTools();

    // Kiểm tra khi resize
    window.addEventListener("resize", checkDevTools);

    // Kiểm tra định kỳ với tần suất cao hơn
    const interval = setInterval(checkDevTools, 100);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", preventContextMenu, { capture: true });
      document.removeEventListener("keydown", preventKeyboard, { capture: true });
      window.removeEventListener("resize", checkDevTools);
      window.removeEventListener("beforeunload", preventBeforeUnload);
      clearInterval(interval);
    };
  }, []);

  return null;
}

