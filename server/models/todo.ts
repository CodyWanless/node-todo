import { Schema, model, Model } from 'mongoose';
import { ITodoDocument, TodoPriority } from '../interfaces/todo';

const todoSchema = new Schema({
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	},
	completeBy: {
		type: Number,
		default: null
	},
	_creator: {
		required: true,
		type: Schema.Types.ObjectId
	},
	priority: {
		type: Object,
		required: true,
		default: TodoPriority.Medium
	},
	comment: {
		type: String,
		required: false,
		trim: true,
		default: null
	}
});

todoSchema.add({ checklistItems: [todoSchema] });

export const Todo: Model<ITodoDocument> = model<ITodoDocument>(
	'Todo',
	todoSchema
);
