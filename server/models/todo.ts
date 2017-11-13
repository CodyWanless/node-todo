import { Schema, model } from 'mongoose';
import { TodoPriority } from './todo-priority';

var todoSchema = new Schema({
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
	_creator: {
		required: true,
		type: Schema.Types.ObjectId
	},
	priority: {
		type: Object,
		required: true,
		default: TodoPriority.MEDIUM
	}
});

todoSchema.add({ checklistItems: [todoSchema] });

const Todo = model('Todo', todoSchema);

export { Todo };
