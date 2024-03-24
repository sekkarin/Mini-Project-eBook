import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  async seedCategories(): Promise<void> {
    // const categories: Category[] = [
    //   { name: 'คอมพิวเตอร์' },
    //   { name: 'การพัฒนาตัวเอง' },
    //   { name: 'ศิลปะ' },
    //   { name: 'ปรัชญาชีวิต' },
    //   { name: 'ภาษา' },
    //   { name: 'สุขภาพ' },
    //   { name: 'วิทยาศาสตร์' },
    //   { name: 'ประวัติศาสตร์' },
    //   { name: 'ท่องเที่ยว' },
    //   { name: 'การเมือง' },
    //   { name: 'วัฒนธรรม' },
    //   { name: 'การศึกษา' },
    //   { name: 'เศรษฐศาสตร์' },
    //   { name: 'กีฬา' },
    //   { name: 'ความสัมพันธ์' },
    //   { name: 'การเรียนรู้' },
    //   { name: 'เทคโนโลยี' },
    //   { name: 'อาหารและสุขภาพ' },
    //   { name: 'เพลง' },
    //   { name: 'ธรรมะ' },
    //   // เพิ่มข้อมูลอื่นๆ ตามต้องการ
    // ];

    // await this.categoryModel.create(categories);
  }
}
