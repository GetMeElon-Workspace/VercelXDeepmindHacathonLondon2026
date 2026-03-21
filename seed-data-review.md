# Seed Data Review: Plant A — Base Model (US Gulf Coast)

> **Please review this data before we code it in.**
> This is the pre-seeded model that loads when the app first opens.
> It represents a simplified **methanol production plant** on the US Gulf Coast.
> The scenario we'll demo: "Branch this model for France."

---

## Why Methanol?
- Simple enough to visualize in 6-7 nodes (not 200 rows of Excel)
- Has clear physical + financial components (feedstock, heat, product, cost)
- Easy to branch geographically — natural gas prices, electricity, labor, carbon tax all change by region
- Non-trivial enough to impress judges ("this isn't a to-do app")

---

## Node Graph (Visual Layout)

```
  ┌──────────────┐
  │   Feedstock   │
  │    Input      │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐       ┌──────────────┐
  │   Reactor /   │──────▶│     Heat     │
  │   Synthesis   │       │  Recovery    │
  └──────┬───────┘       └──────┬───────┘
         │                      │
         ▼                      │
  ┌──────────────┐              │
  │ Distillation  │◀────────────┘
  │ / Separation  │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐       ┌──────────────┐
  │   Product     │       │   Utilities  │
  │   Output      │       │   & Energy   │
  └──────┬───────┘       └──────┬───────┘
         │                      │
         ▼                      ▼
  ┌──────────────────────────────────────┐
  │          Financial Summary           │
  └──────────────────────────────────────┘
```

---

## Node Details

### Node 1: Feedstock Input
| Parameter | Value | Unit |
|---|---|---|
| Feedstock Type | Natural Gas | — |
| Feed Rate | 1,200 | tonnes/day |
| Natural Gas Price | $2.50 | $/MMBtu |
| Methane Content | 95 | % |
| Supply Contract | Henry Hub Spot | — |

> **Why this matters for branching:** Natural gas prices vary wildly by geography. France would use TTF (European benchmark) at ~$10-12/MMBtu — a 4x increase that cascades through the whole model.

---

### Node 2: Reactor / Synthesis
| Parameter | Value | Unit |
|---|---|---|
| Process | Steam Methane Reforming (SMR) | — |
| Operating Temp | 850 | °C |
| Operating Pressure | 25 | bar |
| Conversion Efficiency | 92 | % |
| Catalyst Type | Nickel-based | — |
| Catalyst Lifetime | 3 | years |

> **Why this matters for branching:** Conversion efficiency may need adjustment for different feedstock compositions available in France. Catalyst costs also vary.

---

### Node 3: Heat Recovery
| Parameter | Value | Unit |
|---|---|---|
| Heat Exchanger Type | Shell & Tube | — |
| Heat Recovery Rate | 78 | % |
| Inlet Temp (Hot Side) | 850 | °C |
| Outlet Temp (Hot Side) | 320 | °C |
| Steam Generated | 45 | tonnes/hr |

> **Why this matters for branching:** Heat recovery feeds into utilities/energy. French plants may have different environmental regulations on waste heat.

---

### Node 4: Distillation / Separation
| Parameter | Value | Unit |
|---|---|---|
| Product Purity | 99.85 | % (AA Grade) |
| Separation Stages | 42 | trays |
| Reflux Ratio | 1.8 | — |
| Energy Consumption | 3.2 | GJ/tonne |
| Byproduct (Fusel Oil) | 0.4 | % of feed |

> **Why this matters for branching:** Energy consumption is a major cost driver. French electricity prices (~€0.15/kWh industrial) vs. US (~$0.07/kWh) doubles this cost component.

---

### Node 5: Product Output
| Parameter | Value | Unit |
|---|---|---|
| Product | Methanol (AA Grade) | — |
| Output Rate | 1,050 | tonnes/day |
| Product Price | $420 | $/tonne |
| Annual Output | 346,500 | tonnes/year |
| Annual Revenue | $145.5M | $/year |

> **Why this matters for branching:** European methanol prices differ from US. Also need to consider EUR/USD exchange rate for a French plant.

---

### Node 6: Utilities & Energy
| Parameter | Value | Unit |
|---|---|---|
| Electricity Price | $0.07 | $/kWh |
| Electricity Consumption | 85 | MW |
| Water Consumption | 2,800 | m³/day |
| Water Cost | $1.20 | $/m³ |
| Carbon Emissions | 0.68 | tonnes CO₂/tonne MeOH |
| Carbon Cost | $0 | $/tonne CO₂ (no US carbon tax) |

> **Why this matters for branching:** This is the **biggest delta** for France. EU ETS carbon price is ~€90/tonne CO₂. That's a ~$62M/year cost that doesn't exist in the US model. French electricity is also 2x more expensive. This node will light up with changes.

---

### Node 7: Financial Summary
| Parameter | Value | Unit |
|---|---|---|
| Annual Revenue | $145.5M | $/year |
| Feedstock Cost | $39.4M | $/year |
| Energy Cost | $52.1M | $/year |
| Labor Cost | $8.2M | $/year |
| Maintenance | $6.8M | $/year |
| Carbon Cost | $0 | $/year |
| **EBITDA** | **$39.0M** | **$/year** |
| EBITDA Margin | 26.8 | % |
| CAPEX (Est.) | $320M | — |
| Simple Payback | 8.2 | years |

> **Why this matters for branching:** When Gemini branches to France, the financial summary will shift dramatically — higher feedstock, higher energy, massive carbon cost addition, different labor rates. EBITDA could drop substantially, which is the "aha" moment in the demo.

---

## Edges (Connections)

| Source | Target | Meaning |
|---|---|---|
| Feedstock Input | Reactor / Synthesis | Raw material flows into reactor |
| Reactor / Synthesis | Heat Recovery | Reaction heat is captured |
| Reactor / Synthesis | Distillation / Separation | Crude product goes to purification |
| Heat Recovery | Distillation / Separation | Recovered heat provides energy for distillation |
| Distillation / Separation | Product Output | Purified methanol goes to output |
| Utilities & Energy | Reactor / Synthesis | Power and water supply to reactor |
| Utilities & Energy | Distillation / Separation | Power supply to distillation |
| All Nodes | Financial Summary | All costs roll up into financials |

---

## What Gemini Should Propose for "Branch to France"

When the user types "Branch this model for France," we expect Gemini to propose **2-3 new/modified nodes** like:

1. **Feedstock Input (FR)** — Natural gas at TTF pricing (~$10.50/MMBtu vs. $2.50), different supply contract
2. **Utilities & Energy (FR)** — French electricity at €0.15/kWh, EU ETS carbon at €90/tonne CO₂, potentially nuclear baseload benefits
3. **Financial Summary (FR)** — Updated costs cascading through, showing EBITDA impact

This is the "whoa" moment: the financial impact of geography becomes instantly visible as new nodes appear on the canvas.

---

## Review Checklist

- [ ] Do the node categories make sense? (feedstock → reactor → heat → distillation → product → utilities → financials)
- [ ] Are the data values realistic enough? (they don't need to be perfect, but shouldn't be laughably wrong)
- [ ] Is the "branch to France" scenario compelling? (big deltas in nat gas price, carbon tax, electricity)
- [ ] Are there too many or too few nodes? (targeting 6-7 for visual clarity)
- [ ] Any parameters that should be added or removed?

**Please mark up or comment, and I'll adjust before coding it in.**
