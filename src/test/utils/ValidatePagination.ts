import type { IPagination } from '../../backend/interface/Pagination'

function ValidatePagination(metadata: IPagination['metadata']) {
	expect(metadata).toMatchObject({
		totalItems: expect.any(Number),
		totalPages: expect.any(Number),
		currentPage: expect.any(Number),
		pageSize: expect.any(Number),
		hasNextPage: expect.any(Boolean),
		hasPrevPage: expect.any(Boolean),
	})

	const isStringOrNull = (val: unknown) =>
		typeof val === 'string' || val === null
	expect(isStringOrNull(metadata.nextPageUrl)).toBe(true)
	expect(isStringOrNull(metadata.prevPageUrl)).toBe(true)
}

export default ValidatePagination
