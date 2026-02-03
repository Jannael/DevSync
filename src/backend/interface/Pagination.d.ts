export interface IPagination {
	totalItems: number
	totalPages: number
	currentPage: number
	pageSize: number
	nextPageUrl: string
	prevPageUrl: string
	hasNextPage: boolean
	hasPrevPage: boolean
}
