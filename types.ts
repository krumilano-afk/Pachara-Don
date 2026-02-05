
export interface Question {
    id: number;
    difficulty: 'Warm Up' | 'Intermediate' | 'Exam Level' | 'String Logic' | 'Boss Level';
    title: string;
    desc: string;
    schema: 'main'; // keyof typeof schemas
    solution: string;
    logic: string;
}
