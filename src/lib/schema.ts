import { z } from 'zod';

export const NodeProposalSchema = z.object({
  proposals: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      type: z.enum(['calc', 'physics', 'financial']),
      data: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      ),
      rationale: z.string(),
      sourceLinks: z.array(z.string()).optional(),
    })
  ),
});

export type NodeProposal = z.infer<typeof NodeProposalSchema>;
export type Proposal = NodeProposal['proposals'][number];
