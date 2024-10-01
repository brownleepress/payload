import type { Endpoint } from '../config/types.js'

import { runAllWorkflowsAndJobs, type RunJobsArgs } from './runAllWorkflowsAndJobs.js'

export const runWorkflowEndpoint: Endpoint = {
  handler: async (req) => {
    if (
      !Array.isArray(req.payload.config.jobs.workflows) ||
      !(req.payload.config.jobs?.workflows?.length > 0)
    ) {
      return Response.json(
        {
          message: 'No jobs to run.',
        },
        { status: 200 },
      )
    }

    const hasAccess = await req.payload.config.jobs.access.run({ req })

    if (!hasAccess) {
      return Response.json(
        {
          message: req.i18n.t('error:unauthorized'),
        },
        { status: 401 },
      )
    }

    const { limit, queue } = req.query

    const runJobsArgs: RunJobsArgs = {
      queue: 'default',
      req,
    }

    if (typeof queue === 'string') {
      runJobsArgs.queue = queue
    }

    if (typeof limit !== 'undefined') {
      runJobsArgs.limit = Number(limit)
    }

    try {
      await runAllWorkflowsAndJobs(runJobsArgs)
    } catch (err) {
      req.payload.logger.error({
        err,
        msg: 'There was an error running jobs:',
        queue: runJobsArgs.queue,
      })

      return Response.json(
        {
          message: req.i18n.t('error:unknown'),
        },
        { status: 500 },
      )
    }

    return Response.json(
      {
        message: req.i18n.t('general:success'),
      },
      { status: 200 },
    )
  },
  method: 'get',
  path: '/run',
}