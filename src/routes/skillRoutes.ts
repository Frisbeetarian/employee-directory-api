import express from 'express';

import SkillController from '../controllers/SkillController';

const skillRouter = express.Router();

// GET /skills - Get all skills
skillRouter.get('/', SkillController.getSkills)

// GET /skills/:uuid - Get a skill by UUID
skillRouter.get('/:uuid', SkillController.getSkillByUuid)

// POST /skills - Create a new skill
skillRouter.post('/', SkillController.createSkill)

// PUT /skills/:uuid - Update a skill
skillRouter.put('/:uuid', SkillController.updateSkill);

// DELETE /skills/:uuid - Delete a skill
skillRouter.delete('/:uuid', SkillController.deleteSkill)

export default skillRouter;
