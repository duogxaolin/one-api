# phân tích repo https://github.com/songquanpeng/one-api.git và hiểu cách hoạt động của nó.
# thêm ngôn ngữ tiếng việt
# thay đổi giao diện cho hiện tại, models hơn với màu chủ đạo trắng xanh lá. màu sắc đơn giản, hài hòa.
# thêm chức năng deploy bằng docker 
# remote git remote add origin https://github.com/duogxaolin/one-api.git
# BẮT BUỘC COMMIT VÀ PUSH LÊN GITHUB ĐỂ CÓ THỂ ROLLBACK NẾU CẦN SAU KHI XONG MỖI 1 CHỨC NĂNG LỚN CHỨ KHÔNG PHẢI PUSH LÚC XONG ALL TASK (mỗi lần commit dùng git add . để k bỏ lỡ gì, GỘP NHỮNG CHỈNH SỬA CÙNG CHỨC NĂNG VÀO 1 COMMIT- là xong 1 nhóm chức năng sẽ commit luôn rồi đến làm cái khác ).
# với sửa SQL nhớ thêm 1 file trong folder database để dễ đồng bộ)
# trước khi bắt đầu code kiểm tra xem code đã được commit và push lên github chưa nếu chưa thì commit và push lên github trước khi bắt đầu code. nếu đã commit và push lên github thì bắt đầu code
# Mỗi khi xong một chức năng sẽ thêm file chi tiết về cách hoạt động, quy tắc của nó vào folder docs để dễ dàng truy cập và tham khảo sau này.
# Mỗi khi code phải kiểm tra được nó đã được thực hiện chưa trong docs để đảm bảo đúng cấu trúc.
# code tuân thủ nguyên tắc **YAGNI** (You Aren't Gonna Need It), **KISS** (Keep It Simple, Stupid), và **DRY** (Don't Repeat Yourself).
