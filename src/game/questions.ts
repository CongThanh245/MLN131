import type { Question } from './types.ts';

/**
 * Question bank for MLN131 – Chủ nghĩa xã hội khoa học, Chương 7 mục III:
 * "Xây dựng gia đình Việt Nam trong thời kỳ quá độ lên chủ nghĩa xã hội".
 * Every item is taken from the group's presentation outline; `ref` names the part
 * of that outline (1, 2a-2d, 3a-3b, 4) so the group can check it against the textbook.
 */
type Row = [id: string, text: string, correct: string, wrong: [string, string, string], hint: string, explain: string, ref: string];

const rows: Row[] = [
  // ===== Mục 1 – Sự biến đổi của gia đình Việt Nam =====
  ['Q01', 'Gia đình Việt Nam ngày nay được gọi là kiểu gia đình gì?', 'Gia đình quá độ', ['Gia đình truyền thống', 'Gia đình phụ hệ', 'Gia đình xã hội chủ nghĩa hoàn chỉnh'],
    'Gắn với tên của thời kỳ lịch sử hiện nay.', 'Gia đình Việt Nam ngày nay là "gia đình quá độ", đang trong bước chuyển từ xã hội nông nghiệp cổ truyền sang xã hội công nghiệp hiện đại.', 'Mục 1'],
  ['Q02', 'Gia đình Việt Nam đang chuyển biến từ kiểu xã hội nào sang kiểu xã hội nào?', 'Từ xã hội nông nghiệp cổ truyền sang xã hội công nghiệp hiện đại', ['Từ xã hội công nghiệp sang xã hội hậu công nghiệp', 'Từ xã hội phong kiến sang xã hội tư bản chủ nghĩa', 'Từ xã hội đô thị sang xã hội nông thôn'],
    'Gắn với công nghiệp hóa, hiện đại hóa.', 'Đây là bước chuyển cơ bản khiến gia đình Việt Nam mang tính "quá độ".', 'Mục 1'],
  ['Q03', 'Kiểu gia đình nào đang trở nên phổ biến ở cả đô thị và nông thôn Việt Nam?', 'Gia đình đơn (gia đình hạt nhân)', ['Gia đình nhiều thế hệ', 'Gia đình đơn thân', 'Gia đình dòng họ mở rộng'],
    'Thường chỉ gồm cha mẹ và con cái.', 'Gia đình đơn (hạt nhân) phổ biến dần, thay thế kiểu gia đình truyền thống nhiều thế hệ.', 'Mục 1'],
  ['Q04', 'Quy mô gia đình Việt Nam hiện nay phổ biến gồm mấy thế hệ chung sống?', '2 thế hệ', ['1 thế hệ', '3 thế hệ', '4 thế hệ'],
    'Cha mẹ và con cái.', 'Quy mô thu nhỏ: 2 thế hệ chung sống thay cho 3-4 thế hệ như gia đình truyền thống.', 'Mục 1'],
  ['Q05', 'Gia đình truyền thống Việt Nam thường có bao nhiêu thế hệ chung sống?', '3-4 thế hệ', ['1-2 thế hệ', '2 thế hệ', '5-6 thế hệ'],
    '"Tam đại, tứ đại đồng đường".', 'Gia đình truyền thống nhiều thế hệ (3-4 thế hệ) đang dần được thay thế bằng gia đình 2 thế hệ.', 'Mục 1'],
  ['Q06', 'Điều nào sau đây KHÔNG phải là biểu hiện của sự biến đổi quy mô, kết cấu gia đình Việt Nam?', 'Gia đình nhiều thế hệ ngày càng phổ biến', ['Xuất hiện một số ít gia đình đơn thân', 'Bình đẳng nam nữ được đề cao hơn', 'Cuộc sống riêng tư được coi trọng hơn'],
    'Xu hướng thực tế là quy mô thu nhỏ lại.', 'Biến đổi gồm: quy mô thu nhỏ, có gia đình đơn thân, đề cao bình đẳng nam nữ, coi trọng riêng tư, tránh được nhiều mâu thuẫn của gia đình truyền thống.', 'Mục 1'],
  ['Q07', 'Mặt tích cực của sự biến đổi quy mô, kết cấu gia đình là:', 'Thích nghi, phù hợp hơn với tình hình mới; đề cao bình đẳng, tự do cá nhân', ['Gìn giữ trọn vẹn giá trị văn hóa truyền thống', 'Tăng sự gắn kết không gian giữa các thế hệ', 'Xóa bỏ hoàn toàn mâu thuẫn trong gia đình'],
    'Hướng tới thời đại mới và quyền của từng người.', 'Tích cực: xã hội thích nghi, phù hợp hơn với thời đại mới; đề cao bình đẳng, tự do cá nhân.', 'Mục 1'],
  ['Q08', 'Mặt hạn chế của sự biến đổi quy mô gia đình là:', 'Tạo ngăn cách không gian giữa các thành viên, khó gìn giữ tình cảm và giá trị truyền thống', ['Làm tăng quy mô gia đình', 'Làm mất quyền bình đẳng nam nữ', 'Buộc các thế hệ phải sống chung'],
    'Các thế hệ sống xa nhau hơn.', 'Hạn chế: ngăn cách không gian giữa các thành viên, khó gìn giữ tình cảm và giá trị văn hóa truyền thống của gia đình.', 'Mục 1'],

  // ===== Mục 2a – Chức năng tái sản xuất ra con người =====
  ['Q09', 'Việc sinh đẻ trong gia đình Việt Nam hiện nay được tiến hành như thế nào?', 'Chủ động, tự giác: tự xác định số con và thời điểm sinh', ['Hoàn toàn tự nhiên, không kế hoạch', 'Do dòng họ quyết định', 'Bắt buộc phải sinh đủ con trai'],
    'Nhờ y học và kế hoạch hóa gia đình.', 'Sinh đẻ được tiến hành chủ động, tự giác; đồng thời còn chịu sự điều chỉnh của chính sách xã hội của Nhà nước.', 'Mục 2a'],
  ['Q10', 'Ngoài quyết định của vợ chồng, việc sinh con còn chịu sự điều chỉnh của yếu tố nào?', 'Chính sách xã hội của Nhà nước', ['Ý kiến của dòng họ', 'Phong tục làng xã', 'Quy định của nơi làm việc'],
    'Một chủ thể quản lý xã hội.', 'Việc sinh con chịu sự điều chỉnh của chính sách xã hội của Nhà nước (chính sách dân số, kế hoạch hóa gia đình).', 'Mục 2a'],
  ['Q11', 'Xu hướng nào sau đây đúng với chức năng sinh sản của gia đình Việt Nam hiện nay?', 'Giảm mức sinh, giảm số con mong muốn và giảm nhu cầu nhất thiết phải có con trai', ['Tăng mức sinh và tăng nhu cầu có con trai', 'Giảm mức sinh nhưng tăng nhu cầu có con trai', 'Số con mong muốn tăng lên'],
    'Ba chữ "giảm".', 'Mức sinh của phụ nữ giảm, số con mong muốn giảm, nhu cầu nhất thiết phải có con trai cũng giảm.', 'Mục 2a'],
  ['Q12', 'Ngày nay, sự bền vững của hôn nhân phụ thuộc nhiều vào yếu tố nào?', 'Yếu tố tâm lý, tình cảm, kinh tế', ['Chỉ ở việc có con hay không', 'Chỉ ở việc có con trai nối dõi', 'Sự sắp đặt của cha mẹ hai bên'],
    'Không chỉ là chuyện con cái.', 'Sự bền vững của hôn nhân phụ thuộc nhiều vào tâm lý, tình cảm, kinh tế, không chỉ ở việc có con hay có con trai.', 'Mục 2a'],

  // ===== Mục 2b – Chức năng kinh tế và tổ chức tiêu dùng =====
  ['Q13', 'Bước chuyển thứ nhất mang tính bước ngoặt của kinh tế gia đình là:', 'Từ kinh tế tự cấp tự túc sang kinh tế hàng hóa', ['Từ kinh tế hàng hóa sang kinh tế tự cấp tự túc', 'Từ kinh tế thị trường sang kinh tế kế hoạch', 'Từ sản xuất công nghiệp sang sản xuất nông nghiệp'],
    'Từ "làm ra để dùng" sang "làm ra để bán".', 'Bước chuyển thứ nhất: từ kinh tế tự cấp tự túc thành kinh tế hàng hóa.', 'Mục 2b'],
  ['Q14', 'Bước chuyển thứ hai của kinh tế gia đình là trở thành tổ chức kinh tế phục vụ thị trường nào?', 'Thị trường toàn cầu', ['Thị trường làng xã', 'Thị trường trong dòng họ', 'Chỉ thị trường quốc gia'],
    'Gắn với hội nhập quốc tế.', 'Từ đơn vị sản xuất phục vụ thị trường quốc gia thành tổ chức kinh tế của nền kinh tế thị trường hiện đại, phục vụ thị trường toàn cầu.', 'Mục 2b'],
  ['Q15', 'Kinh tế gia đình hiện nay có vị trí như thế nào đối với nền kinh tế?', 'Là bộ phận quan trọng của nền kinh tế quốc dân', ['Không còn vai trò gì', 'Là thành phần kinh tế duy nhất', 'Chỉ phục vụ nhu cầu nội bộ gia đình'],
    'Liên quan đến kinh tế cả nước.', 'Kinh tế gia đình trở thành bộ phận quan trọng của nền kinh tế quốc dân.', 'Mục 2b'],
  ['Q16', 'Xu hướng tiêu dùng của gia đình hiện nay là:', '"Tiêu dùng sản phẩm do người khác làm ra", tức dùng hàng hóa, dịch vụ xã hội', ['Tự sản xuất tất cả những gì mình dùng', 'Hạn chế tối đa việc mua hàng hóa', 'Chỉ dùng sản phẩm của dòng họ làm ra'],
    'Mua hàng hóa, thuê dịch vụ.', 'Gia đình là đơn vị tiêu dùng quan trọng; xu hướng tiêu dùng hàng hóa, dịch vụ do xã hội cung cấp.', 'Mục 2b'],

  // ===== Mục 2c – Chức năng giáo dục (xã hội hóa) =====
  ['Q17', 'Trong xã hội truyền thống, mối quan hệ giữa giáo dục gia đình và giáo dục xã hội là:', 'Giáo dục gia đình là cơ sở của giáo dục xã hội', ['Giáo dục xã hội bao trùm lên giáo dục gia đình', 'Hai loại giáo dục tách biệt hoàn toàn', 'Giáo dục gia đình không có vai trò'],
    'Gia đình là nền móng.', 'Truyền thống: giáo dục gia đình là cơ sở của giáo dục xã hội; ngày nay thì ngược lại.', 'Mục 2c'],
  ['Q18', 'Ngày nay, mối quan hệ giữa giáo dục gia đình và giáo dục xã hội là:', 'Giáo dục xã hội bao trùm lên giáo dục gia đình', ['Giáo dục gia đình là cơ sở của giáo dục xã hội', 'Giáo dục gia đình thay thế giáo dục nhà trường', 'Giáo dục xã hội bị thu hẹp'],
    'Nhà trường, xã hội ngày càng lớn.', 'Ngày nay, giáo dục xã hội bao trùm lên giáo dục gia đình.', 'Mục 2c'],
  ['Q19', 'Đầu tư tài chính của gia đình cho giáo dục con cái hiện nay có xu hướng:', 'Tăng lên', ['Giảm xuống', 'Không thay đổi', 'Do Nhà nước chi trả hoàn toàn'],
    'Học thêm, học ngoại ngữ, du học...', 'Đầu tư tài chính của gia đình cho giáo dục con cái tăng lên.', 'Mục 2c'],
  ['Q20', 'Nội dung giáo dục gia đình hiện nay, ngoài đạo đức và ứng xử, còn mở rộng sang:', 'Kiến thức khoa học hiện đại, giúp con hòa nhập với thế giới', ['Chỉ lễ nghi dòng họ', 'Chỉ kỹ năng làm nông nghiệp', 'Chỉ phong tục làng xã'],
    'Hướng ra thế giới.', 'Ngoài đạo đức, ứng xử trong gia đình, dòng họ, làng xã còn có kiến thức khoa học hiện đại giúp con hòa nhập với thế giới.', 'Mục 2c'],
  ['Q21', 'Mặt tiêu cực trong biến đổi chức năng giáo dục của gia đình là:', 'Vai trò giáo dục của gia đình có xu hướng giảm sút', ['Gia đình đầu tư quá ít cho giáo dục', 'Nội dung giáo dục bị thu hẹp', 'Nhà trường không còn vai trò'],
    'Gia đình "dạy" con ít hơn.', 'Vai trò giáo dục của gia đình giảm, hiện tượng tiêu cực trong xã hội và nhà trường gia tăng → vai trò xã hội hóa trẻ em của gia đình giảm sút đáng kể.', 'Mục 2c'],

  // ===== Mục 2d – Chức năng thỏa mãn nhu cầu tâm sinh lý, duy trì tình cảm =====
  ['Q22', 'Nhu cầu thỏa mãn tâm sinh lý, duy trì tình cảm trong gia đình hiện nay có xu hướng:', 'Tăng lên', ['Giảm xuống', 'Không còn quan trọng', 'Được xã hội thay thế hoàn toàn'],
    'Gia đình ngày càng là "tổ ấm".', 'Nhu cầu này đang tăng lên khi gia đình chuyển thành đơn vị chủ yếu về tình cảm.', 'Mục 2d'],
  ['Q23', 'Gia đình Việt Nam đang chuyển từ chủ yếu là đơn vị gì sang chủ yếu là đơn vị gì?', 'Từ đơn vị kinh tế sang đơn vị tình cảm', ['Từ đơn vị tình cảm sang đơn vị kinh tế', 'Từ đơn vị chính trị sang đơn vị kinh tế', 'Từ đơn vị tiêu dùng sang đơn vị sản xuất'],
    'Tình cảm ngày càng quan trọng.', 'Gia đình chuyển từ chủ yếu là đơn vị kinh tế sang chủ yếu là đơn vị tình cảm.', 'Mục 2d'],
  ['Q24', 'Tỷ lệ gia đình một con tăng lên dẫn đến hệ quả gì?', 'Đời sống tâm lý – tình cảm của trẻ em và người lớn kém phong phú hơn', ['Trẻ em có nhiều anh chị em hơn', 'Mâu thuẫn thế hệ biến mất', 'Quy mô gia đình tăng lên'],
    'Ít anh chị em để chia sẻ.', 'Gia đình một con tăng khiến đời sống tâm lý – tình cảm của trẻ em và người lớn kém phong phú hơn.', 'Mục 2d'],
  ['Q25', 'Công nghiệp hóa, toàn cầu hóa gây ra hệ quả nào giữa các gia đình?', 'Phân hóa giàu nghèo sâu sắc', ['Xóa bỏ hoàn toàn khoảng cách giàu nghèo', 'Mọi gia đình có thu nhập như nhau', 'Gia đình trở lại tự cấp tự túc'],
    'Khoảng cách thu nhập.', 'Công nghiệp hóa, toàn cầu hóa dẫn đến phân hóa giàu nghèo sâu sắc giữa các gia đình.', 'Mục 2d'],
  ['Q26', 'Đâu KHÔNG phải là trách nhiệm của Nhà nước được nêu trong việc củng cố các chức năng gia đình?', 'Quyết định số con cụ thể của từng gia đình', ['Chính sách hỗ trợ hộ nghèo, khắc phục khoảng cách giàu nghèo', 'Bảo đảm an toàn tình dục, giáo dục giới tính và sức khỏe sinh sản', 'Xây dựng nội dung và phương pháp mới về giáo dục gia đình'],
    'Sinh đẻ là do gia đình chủ động, tự giác.', 'Nhà nước: hỗ trợ hộ nghèo; bảo đảm an toàn tình dục, giáo dục giới tính, sức khỏe sinh sản; củng cố chức năng xã hội hóa; xây dựng chuẩn mực, nội dung, phương pháp mới về giáo dục gia đình.', 'Mục 2d'],

  // ===== Mục 3a – Quan hệ hôn nhân và quan hệ vợ chồng =====
  ['Q27', 'Quan hệ vợ chồng – gia đình trong thời kỳ quá độ có xu hướng:', 'Lỏng lẻo hơn', ['Bền chặt tuyệt đối', 'Không có gì thay đổi', 'Phụ thuộc hoàn toàn vào dòng họ'],
    'Ly hôn, ly thân gia tăng.', 'Quan hệ vợ chồng – gia đình lỏng lẻo hơn; gia tăng ly hôn, ly thân, ngoại tình, chung sống không kết hôn.', 'Mục 3a'],
  ['Q28', 'Hiện tượng nào sau đây đang gia tăng trong quan hệ hôn nhân?', 'Ly hôn, ly thân, ngoại tình, chung sống không kết hôn', ['Hôn nhân do cha mẹ sắp đặt', 'Tảo hôn ở đô thị', 'Chế độ đa thê'],
    'Những biểu hiện của sự "lỏng lẻo".', 'Gia tăng ly hôn, ly thân, ngoại tình, chung sống không kết hôn.', 'Mục 3a'],
  ['Q29', 'Hệ quả tiêu cực nào xuất hiện từ sự biến đổi quan hệ hôn nhân, gia đình?', 'Bi kịch gia đình, người già cô đơn, trẻ em sống ích kỷ, bạo hành gia đình', ['Quy mô gia đình tăng lên', 'Bình đẳng nam nữ được đề cao', 'Kinh tế hộ gia đình phát triển'],
    'Tác động đến người già, trẻ em.', 'Xuất hiện bi kịch gia đình, người già cô đơn, trẻ em sống ích kỷ, bạo hành gia đình; giá trị truyền thống bị coi nhẹ.', 'Mục 3a'],
  ['Q30', 'Trong quan hệ vợ chồng hiện nay xuất hiện ít nhất mấy kiểu gia đình theo người làm chủ?', '3 kiểu', ['1 kiểu', '2 kiểu', '5 kiểu'],
    'Chồng, vợ, hoặc cả hai.', 'Ít nhất 3 kiểu: người chồng làm chủ, cả hai vợ chồng cùng làm chủ, người vợ làm chủ.', 'Mục 3a'],
  ['Q31', 'Kiểu gia đình "người chồng làm chủ" được xem là:', 'Kiểu gia đình truyền thống', ['Kiểu gia đình hiện đại nhất', 'Kiểu gia đình mới xuất hiện', 'Kiểu gia đình đơn thân'],
    'Gắn với tư tưởng gia trưởng xưa.', 'Người chồng làm chủ là kiểu gia đình truyền thống; bên cạnh đó còn kiểu cả hai cùng làm chủ và người vợ làm chủ.', 'Mục 3a'],

  // ===== Mục 3b – Quan hệ giữa các thế hệ, giá trị và chuẩn mực văn hóa =====
  ['Q32', 'Trong gia đình hiện nay, giáo dục trẻ em có xu hướng:', 'Gần như phó mặc cho nhà trường, thiếu sự dạy bảo thường xuyên của ông bà, cha mẹ', ['Do ông bà dạy bảo hoàn toàn', 'Do dòng họ đảm nhận', 'Không cần đến nhà trường'],
    'Cha mẹ bận rộn công việc.', 'Giáo dục trẻ em gần như phó mặc cho nhà trường, thiếu sự dạy bảo thường xuyên của ông bà, cha mẹ.', 'Mục 3b'],
  ['Q33', 'Người cao tuổi trong gia đình hiện nay đối mặt với vấn đề gì?', 'Cô đơn, thiếu thốn tình cảm', ['Thiếu quyền quyết định tài chính quốc gia', 'Phải lao động nặng nhọc hơn', 'Bị buộc sống chung nhiều thế hệ'],
    'Con cháu sống xa, ít quan tâm.', 'Người cao tuổi đối mặt với cô đơn, thiếu thốn tình cảm.', 'Mục 3b'],
  ['Q34', 'Thách thức lớn nhất trong quan hệ giữa các thế hệ của gia đình hiện nay là:', 'Mâu thuẫn giữa các thế hệ', ['Mâu thuẫn giữa các dòng họ', 'Mâu thuẫn giữa các vùng miền', 'Mâu thuẫn giữa gia đình và nhà trường'],
    'Ông bà – cha mẹ – con cháu.', 'Thách thức lớn nhất là mâu thuẫn giữa người cao tuổi và người trẻ.', 'Mục 3b'],
  ['Q35', 'Trong mâu thuẫn thế hệ, người cao tuổi thường có xu hướng:', 'Hướng về giá trị truyền thống, có xu hướng bảo thủ, áp đặt', ['Hướng tới giá trị hiện đại, phủ nhận truyền thống', 'Hoàn toàn đồng tình với người trẻ', 'Không quan tâm đến giá trị gia đình'],
    'Gắn với cái cũ.', 'Người cao tuổi hướng về giá trị truyền thống, có xu hướng bảo thủ, áp đặt; người trẻ hướng tới giá trị hiện đại.', 'Mục 3b'],
  ['Q36', 'Trong mâu thuẫn thế hệ, người trẻ thường có xu hướng:', 'Hướng tới giá trị hiện đại, phủ nhận yếu tố truyền thống', ['Hướng về giá trị truyền thống, bảo thủ', 'Áp đặt quan điểm lên người cao tuổi bằng quyền lực', 'Từ chối mọi giá trị hiện đại'],
    'Gắn với cái mới.', 'Người trẻ hướng tới giá trị hiện đại, có xu hướng phủ nhận yếu tố truyền thống. Nguyên nhân: khác biệt tuổi tác khi cùng chung sống.', 'Mục 3b'],

  // ===== Mục 4 – Phương hướng cơ bản =====
  ['Q37', 'Phương hướng thứ nhất xây dựng và phát triển gia đình Việt Nam là:', 'Tăng cường sự lãnh đạo của Đảng, nâng cao nhận thức của xã hội về xây dựng và phát triển gia đình', ['Đẩy mạnh phát triển kinh tế – xã hội', 'Phát triển phong trào xây dựng gia đình văn hóa', 'Kế thừa giá trị gia đình truyền thống'],
    'Bắt đầu từ vai trò lãnh đạo và nhận thức.', 'Thứ nhất: tăng cường sự lãnh đạo của Đảng, nâng cao nhận thức của xã hội về xây dựng và phát triển gia đình Việt Nam.', 'Mục 4'],
  ['Q38', '"Đẩy mạnh phát triển kinh tế – xã hội, nâng cao đời sống vật chất, kinh tế hộ gia đình" là phương hướng thứ mấy?', 'Thứ hai', ['Thứ nhất', 'Thứ ba', 'Thứ tư'],
    'Ngay sau vai trò lãnh đạo của Đảng.', 'Bốn phương hướng: (1) lãnh đạo của Đảng, nhận thức xã hội; (2) phát triển kinh tế – xã hội; (3) kế thừa truyền thống, tiếp thu tiến bộ; (4) phong trào gia đình văn hóa.', 'Mục 4'],
  ['Q39', 'Phương hướng thứ ba yêu cầu điều gì?', 'Kế thừa giá trị gia đình truyền thống, đồng thời tiếp thu những tiến bộ của nhân loại về gia đình', ['Xóa bỏ toàn bộ giá trị gia đình truyền thống', 'Chỉ giữ nguyên mô hình gia đình truyền thống', 'Sao chép hoàn toàn mô hình gia đình phương Tây'],
    'Vừa giữ gốc, vừa đổi mới.', 'Thứ ba: kế thừa những giá trị của gia đình truyền thống đồng thời tiếp thu những tiến bộ của nhân loại về gia đình.', 'Mục 4'],
  ['Q40', 'Mục tiêu xây dựng gia đình Việt Nam được nêu trong kết luận là gia đình:', 'No ấm, tiến bộ, hạnh phúc, văn minh', ['Giàu có, đông con, nhiều thế hệ', 'Độc lập, tự cấp, tự túc', 'Gia trưởng, nề nếp, khép kín'],
    'Bốn tính từ, thực hiện bằng 4 phương hướng.', 'Cần thực hiện đồng bộ 4 phương hướng (thứ tư: phát triển, nâng cao chất lượng phong trào xây dựng gia đình văn hóa) để xây dựng gia đình no ấm, tiến bộ, hạnh phúc, văn minh.', 'Mục 4 · Kết luận']
];

export const QUESTION_BANK: Question[] = rows.map(([id, text, correct, wrong, hint, explain, ref]) => ({ id, text, correct, wrong, hint, explain, ref }));
export const questionById = new Map(QUESTION_BANK.map((q) => [q.id, q]));
