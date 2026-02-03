export interface IPagination {
	totalItems: number
	totalPages: number
	currentPage: number
	pageSize: number
	nextPageUrl: string | null
	prevPageUrl: string | null
	hasNextPage: boolean
	hasPrevPage: boolean
}
