import { Todo, TodoPriority } from './todo';

export class TodoFactory {
	public static createFromRequest(requestBody) {
		return new Todo({
			text: requestBody.text,
			completeBy: requestBody.completeBy,
			checklistItems: requestBody.checklistItems,
			priority: this.convertTodoPriority(requestBody.priority),
			_creator: requestBody.user._id
		});
	}

	private static convertTodoPriority(priority) {
		switch (priority) {
			case 1:
				return TodoPriority.Low;
			case 2:
				return TodoPriority.Medium;
			case 3:
				return TodoPriority.High;
			case 4:
				return TodoPriority.Urgent;
			case undefined:
				return TodoPriority.Medium;
			default:
				throw new Error('Unable to convert priority');
		}
	}
}
