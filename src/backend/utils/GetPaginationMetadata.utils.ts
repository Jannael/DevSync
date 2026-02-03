import type { Request } from 'express'
import type { IPagination } from '../interface/Pagination'

function GetPaginationMetadata({
	totalItems,
	currentPage,
	pageSize,
	req,
}: {
	req: Request
	totalItems: number
	currentPage: number
	pageSize: number
}): IPagination {
	return {
		totalItems: totalItems,
		totalPages: totalItems / pageSize,
		currentPage: currentPage,
		pageSize: pageSize,
		nextPageUrl:
			currentPage < totalItems / pageSize
				? `${req.originalUrl}?page=${currentPage + 1}`
				: null,
		prevPageUrl:
			currentPage > 1 ? `${req.originalUrl}?page=${currentPage - 1}` : null,
		hasNextPage: currentPage < totalItems / pageSize,
		hasPrevPage: currentPage > 1,
	}
}

export default GetPaginationMetadata
