import {Milestone} from "@/components/CustomMilestoneDialog";

export const sortMilestones = (milestones: Milestone[]): Milestone[] => {
  return milestones.sort((a, b) => {
    if (a.startDate === undefined && b.startDate === undefined) {
      // 如果startDate都为undefined，则比较label
      return a.label.localeCompare(b.label);
    }

    if (a.startDate !== undefined && b.startDate !== undefined) {
      // 如果startDate都有值，则比较startDate
      if (a.startDate.getTime() !== b.startDate.getTime()) {
        return a.startDate.getTime() - b.startDate.getTime();
      }

      // 如果startDate相同，则比较endDate
      if (a.endDate !== undefined && b.endDate !== undefined) {
        if (a.endDate.getTime() !== b.endDate.getTime()) {
          return a.endDate.getTime() - b.endDate.getTime();
        }
      }
    }

    // 如果startDate和endDate都相同，或者有一个是undefined，则比较label
    if (a.startDate === undefined) {
      return 1; // 将未定义的startDate的元素排在末尾
    } else if (b.startDate === undefined) {
      return -1; // 将未定义的startDate的元素排在末尾
    }

    return a.label.localeCompare(b.label);
  });
};