import { Router, type IRouter } from "express";
import { db, surveysTable } from "@workspace/db";
import { SubmitSurveyBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/survey", async (req, res): Promise<void> => {
  const parsed = SubmitSurveyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [survey] = await db
    .insert(surveysTable)
    .values({
      name: parsed.data.name,
      age: parsed.data.age,
      gender: parsed.data.gender,
      qualification: parsed.data.qualification,
      qualificationOther: parsed.data.qualificationOther ?? null,
      services: parsed.data.services,
      experience: parsed.data.experience ?? null,
      ideas: parsed.data.ideas,
    })
    .returning();

  req.log.info({ surveyId: survey.id }, "Survey submitted");

  res.status(201).json({
    id: survey.id,
    name: survey.name,
    createdAt: survey.createdAt.toISOString(),
  });
});

export default router;
