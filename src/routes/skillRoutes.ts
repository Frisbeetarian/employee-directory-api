import express from 'express';

import SkillController from '../controllers/SkillController';

export const skillRouter = (controller: SkillController) => {
    const router = express.Router();

    // GET /skills - Get all skills
    router.get('/', controller.getSkills.bind(controller))

    // GET /skills/:uuid - Get a skill by UUID
    router.get('/:uuid', controller.getSkillByUuid.bind(controller))

    // POST /skills - Create a new skill
    router.post('/', controller.createSkill.bind(controller))

    // PUT /skills/:uuid - Update a skill
    router.put('/:uuid', controller.updateSkill.bind(controller))

    // DELETE /skills/:uuid - Delete a skill
    router.delete('/:uuid', controller.deleteSkill.bind(controller))

    // GET /skills/:uuid/employees - Get employees by skill UUID
    router.get('/:uuid/employees', controller.getEmployeesBySKillUuid.bind(controller))

    return router;
};
