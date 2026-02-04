import SolutionController from '../controller/Solution.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const SolutionAdapter = {
	Get: CreateAdapter({ controller: SolutionController.Get }),
	Create: CreateAdapter({ controller: SolutionController.Create }),
	Update: CreateAdapter({ controller: SolutionController.Update }),
	Delete: CreateAdapter({ controller: SolutionController.Delete }),
}

export default SolutionAdapter
