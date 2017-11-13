const TodoPriority = {
	LOW: { value: 0, name: 'Low' },
	MEDIUM: { value: 1, name: 'Medium' },
	HIGH: { value: 2, name: 'High' },
	VERY_IMP: { value: 3, name: 'Very important' },
	URGENT: { value: 4, name: 'Urgent' }
};

Object.freeze(TodoPriority);

export { TodoPriority };
