import gql from 'graphql-tag';

export const queries = {
  worlds: gql`{
    worlds {
    _id
    name
    globals,
      tiles {
        id,
        name,
        tags,
        zIndex,
        className,
        stamp
      },
      files {
        id
        type
        name,
        source
      },
      themes {
        _id
        name,
        worldOptions {
          editorColor
          lineColor
          lineWidth
          lineHighlightColor
          spacing
        },
        tiles {
          tileId
          name
          url
          scale
        }
      },
      permissions {
        owner
        ownerAccess
        otherAccess
      }
    }
  }`,
  schedule: gql`
    query schedule($id: String, $userId: String) {
      schedule(id: $id, userId: $userId) {
        _id
        name
        description
        startDate
        totalExercises,
        items {
          from
          due
          practicalId
          name
        }
        tutors {
          id
          name
          email
        }
        practicals {
          _id
          name
          image
          description
          createdBy
          updatedAt
          permissions {
            owner
            ownerAccess
            otherAccess
          }
        }
      }
    }`,
  practical: gql`
    query practical($id: String, $userId: String) {
      practical(id: $id, userId: $userId) {
        _id,
        name,
        description,
        exercises {
          _id
          name
          description
          points
          permissions {
            owner
            ownerAccess
            otherAccess
          }
        }
        permissions {
          owner
          ownerAccess
          otherAccess
        }
      }
    }`,
  exercise: gql`
    query exercise($id: String, $userId: String) {
      exercise(id: $id, userId: $userId) {
        _id
        name
        description
        points
        difficulty
        worldId
        image
        allowedCommands
        images
        protectLoops
        createdAt
        createdBy
        createdById
        updatedAt
        updatedBy
        updatedById,
        boards {
          rows
          columns
          worldId
          wrap
          tiles
        },
        files {
          id,
          type,
          name,
          source
        },
        permissions {
          owner
          ownerAccess
          otherAccess
        }
      }
    }`,
  solution: gql`
    query solution($scheduleId: String, $practicalId: String, $exerciseId: String, $userId: String) {
      solution(scheduleId: $scheduleId, practicalId: $practicalId, exerciseId: $exerciseId, userId: $userId) {
        _id
        scheduleId
        practicalId
        exerciseId
        tutorId
        tutorName
        status
        validated
        codeStars
        linesOfCode
        steps
        stepsStars
        mark
        rank
        files {
          id
          type
          name
          source
        }
        comments {
          id
          senderId
          senderName
          senderAvatar
          message
          sent
        }
        submission {
          date
          files {
            id
            type
            name
            source
          }
        }
        locRank
        stepsRank
        createdAt
        createdBy
        createdById
        updatedAt
        updatedBy
        updatedById
      }
    }`
};

export default queries;
