import type { SkillKind } from './types.ts';

export interface SkillDefinition {
  kind: SkillKind;
  name: string;
  icon: string;
  /** When it can be played: before rolling, or while the question is open. */
  timing: 'roll' | 'question';
  target: 'enemy' | 'self';
  copies: number;
  description: string;
  /** Link back to the lecture content so the cards teach as well as play. */
  theme: string;
}

export const SKILLS: SkillDefinition[] = [
  { kind: 'stun', name: 'Ngăn Cách Không Gian', icon: '✂️', timing: 'roll', target: 'enemy', copies: 3,
    description: 'Cả đội của ngựa được chọn mất lượt kế tiếp.', theme: 'Gia đình thu nhỏ tạo ngăn cách không gian giữa các thành viên.' },
  { kind: 'barricade', name: 'Gánh Nặng Kinh Tế', icon: '🚧', timing: 'roll', target: 'enemy', copies: 3,
    description: 'Lần đi kế tiếp của ngựa được chọn tối đa 3 bước.', theme: 'Phân hóa giàu nghèo sâu sắc giữa các gia đình.' },
  { kind: 'push-back', name: 'Bảo Thủ, Áp Đặt', icon: '⏪', timing: 'roll', target: 'enemy', copies: 3,
    description: 'Đẩy ngựa được chọn lùi 5 ô (chỉ khi còn trên vòng đua).', theme: 'Mâu thuẫn thế hệ: xu hướng bảo thủ, áp đặt kéo lùi sự đổi mới.' },
  { kind: 'swap', name: 'Đổi Vai Làm Chủ', icon: '🔄', timing: 'roll', target: 'enemy', copies: 2,
    description: 'Đổi chỗ ngựa dẫn đầu vòng đua của bạn với ngựa được chọn.', theme: 'Chồng làm chủ, vợ làm chủ hay cả hai cùng làm chủ gia đình.' },
  { kind: 'steal', name: 'Lỏng Lẻo Hôn Nhân', icon: '🕵️', timing: 'roll', target: 'enemy', copies: 2,
    description: 'Lấy ngẫu nhiên 1 thẻ kỹ năng từ tay đội của ngựa được chọn.', theme: 'Quan hệ vợ chồng lỏng lẻo hơn: ly hôn, ly thân, ngoại tình gia tăng.' },
  { kind: 'boost', name: 'Kinh Tế Hộ Gia Đình', icon: '🚩', timing: 'roll', target: 'self', copies: 3,
    description: 'Lần đi kế tiếp được cộng thêm 4 bước.', theme: 'Phương hướng thứ hai: nâng cao đời sống vật chất, kinh tế hộ gia đình.' },
  { kind: 'double-dice', name: 'Kế Thừa Và Tiếp Thu', icon: '🎲', timing: 'roll', target: 'self', copies: 2,
    description: 'Lần đổ kế tiếp được tung hai lần, lấy tổng cao hơn.', theme: 'Kế thừa giá trị truyền thống, tiếp thu tiến bộ của nhân loại về gia đình.' },
  { kind: 'shield', name: 'Gia Đình Văn Hóa', icon: '🛡️', timing: 'roll', target: 'self', copies: 3,
    description: 'Chặn kỹ năng đối kháng kế tiếp nhắm vào đội mình.', theme: 'Phong trào xây dựng gia đình văn hóa giữ vững tổ ấm.' },
  { kind: 'hint', name: 'Ông Bà Dạy Bảo', icon: '💡', timing: 'question', target: 'self', copies: 3,
    description: 'Mở dòng gợi ý của câu hỏi hiện tại.', theme: 'Sự dạy bảo thường xuyên của ông bà, cha mẹ.' },
  { kind: 'fifty', name: 'Chọn Lọc Giá Trị', icon: '🎯', timing: 'question', target: 'self', copies: 2,
    description: 'Loại 2 phương án sai của câu hỏi hiện tại.', theme: 'Gạn đục khơi trong: bỏ cái lạc hậu, giữ cái tiến bộ.' }
];

export const skillByKind = Object.fromEntries(SKILLS.map((s) => [s.kind, s])) as Record<SkillKind, SkillDefinition>;
