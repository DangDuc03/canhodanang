document.addEventListener("DOMContentLoaded", function () {
  // Tắt hiệu ứng loading sau khi trang đã tải
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.style.opacity = "0";
    setTimeout(() => {
      loadingOverlay.style.display = "none";
    }, 500);
  }

  // Xử lý cuộn trang cho header và animation các section
  const header = document.getElementById("header");
  const sections = document.querySelectorAll(".fade-in");

  const options = {
    root: null, // viewport
    threshold: 0.2,
    rootMargin: "0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, options);

  sections.forEach((section) => {
    observer.observe(section);
  });

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Xử lý menu hamburger trên mobile
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const navLinksMobile = document.querySelectorAll(".nav-menu-mobile a");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");
    });

    // Đóng menu khi click vào link
    navLinksMobile.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("active");
      });
    });
  }

  // Xử lý smooth scroll cho navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Hiển thị/ẩn mobile CTA button
  const mobileCtaSticky = document.getElementById("mobileCtaSticky");
  if (mobileCtaSticky) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > window.innerHeight) {
        mobileCtaSticky.style.display = "block";
      } else {
        mobileCtaSticky.style.display = "none";
      }
    });
  }

  // Xử lý form liên hệ - PHIÊN BẢN ĐÃ CẬP NHẬT CHO NEW TOWN DIAMOND
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validation cơ bản
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();

      if (!name || !phone) {
        alert(
          "Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên và Số điện thoại)!"
        );
        return;
      }

      // Kiểm tra định dạng số điện thoại cơ bản
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(phone)) {
        alert("Vui lòng nhập số điện thoại hợp lệ (10-11 số)!");
        return;
      }

      // Hàm để chuyển đổi giá trị dropdown thành radio button value
      function getInterestValue() {
        const roomType = document.getElementById("typeroom").value;

        // Chuyển đổi từ dropdown value sang radio value cho New Town Diamond
        if (roomType.includes("1PN")) return "1PN";
        if (roomType.includes("2PN")) return "2PN";
        if (roomType.includes("3PN")) return "3PN";
        if (roomType.includes("support")) return "Cần Tư vấn đầu tư";

        return ""; // Trường hợp không chọn gì
      }

      // LẤY ENTRY IDs CHÍNH XÁC TỪ GOOGLE FORM CỦA BẠN
      // Thay thế các số này bằng entry IDs thực tế từ form New Town Diamond
      const formData = {
        "entry.1351037227": name,
        "entry.2008903050": phone,
        "entry.1611109610": getInterestValue(),
        "entry.102320582": document.getElementById("message").value.trim(),
      };

      // Hiển thị loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = "Đang gửi...";
      submitBtn.disabled = true;

      // Tạo iframe ẩn để submit form
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.name = "hiddenFrame";
      document.body.appendChild(iframe);

      // Tạo form để submit
      const form = document.createElement("form");
      form.method = "POST";
      form.action =
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeskAbtoFXagC87orozEQOwtxRzD9BNZtB9IwPczYrxpKaGDA/formResponse";
      form.target = "hiddenFrame";

      // Thêm các input với dữ liệu (chỉ những trường có giá trị)
      Object.keys(formData).forEach((entryId) => {
        if (formData[entryId] && formData[entryId].trim() !== "") {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = entryId;
          input.value = formData[entryId];
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();

      // Cleanup và thông báo
      setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);

        // Reset button state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;

        // Thông báo thành công với thông tin cụ thể cho New Town Diamond
        alert(
          `Cảm ơn ${name}!\n\n` +
            `Thông tin của bạn đã được gửi thành công đến New Town Diamond.\n` +
            `Chúng tôi sẽ liên hệ với bạn qua số ${phone} trong vòng 24h.\n\n` +
            `Cảm ơn bạn đã quan tâm đến dự án!`
        );

        contactForm.reset();

        // Có thể thêm Google Analytics tracking ở đây
        if (typeof gtag !== "undefined") {
          gtag("event", "form_submit", {
            event_category: "Contact",
            event_label: "New Town Diamond Contact Form",
            value: 1,
          });
        }
      }, 1000);
    });
  }

  // Thêm hiệu ứng cho gallery items
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item, index) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });

  // Thêm hiệu ứng cho pricing cards
  const pricingCards = document.querySelectorAll(".pricing-card");
  pricingCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      if (!this.classList.contains("featured")) {
        this.style.transform = "translateY(-10px)";
      }
    });

    card.addEventListener("mouseleave", function () {
      if (!this.classList.contains("featured")) {
        this.style.transform = "translateY(0)";
      }
    });
  });
});

// HƯỚNG DẪN SỬ DỤNG CHO NEW TOWN DIAMOND:
// 1. Tạo Google Form mới cho dự án New Town Diamond
// 2. Thêm các trường: Họ tên, Số điện thoại, Quan tâm đến (1PN/2PN/3PN/Tư vấn đầu tư), Ghi chú
// 3. Mở Google Form ở chế độ xem trước
// 4. F12 -> Elements tab
// 5. Inspect từng trường input để lấy entry ID
// 6. Thay thế các entry ID trong formData object ở trên
// 7. Cập nhật form action URL với URL form của bạn
// 8. Test lại form để đảm bảo hoạt động đúng

// VÍ DỤ ENTRY IDs CẦN THAY ĐỔI:
// "entry.1351037227" -> entry ID thực tế của trường "Họ và tên"
// "entry.2008903050" -> entry ID thực tế của trường "Số điện thoại"
// "entry.1611109610" -> entry ID thực tế của trường "Quan tâm đến"
// "entry.102320582" -> entry ID thực tế của trường "Ghi chú"
