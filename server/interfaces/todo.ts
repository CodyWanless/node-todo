import { Document } from 'mongoose';

export interface ITodoDocument extends Document {
	text: string;
	completed: boolean;
	completedAt: number;
	completeBy: number;
	priority: TodoPriority;
	comment: string;
	checklistItems: [ITodoDocument];
}

export const enum TodoPriority {
	Low = 1,
	Medium,
	High,
	Urgent
}
